import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload, logLevel } from 'kafkajs';

function safeString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }
  return JSON.stringify(value);
}

@Injectable()
export class AuditEventsConsumer implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;

  private readonly topics = [
    'policy.issued',
    'policy.activated',
    'policy.suspended',
    'policy.reactivated',
    'policy.cancelled',
  ];

  constructor(private readonly config: ConfigService) {
    this.kafka = new Kafka({
      clientId:
        this.config.get<string>('KAFKA_CLIENT_ID', 'insurance-api') + '-audit',
      brokers: [this.config.get<string>('KAFKA_BROKER', 'localhost:9096')],
      logLevel: logLevel.WARN,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connectWithRetry();
  }

  private async connectWithRetry(retries = 5, delay = 5000): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.consumer = this.kafka.consumer({
          groupId: this.config.get<string>(
            'KAFKA_AUDIT_CONSUMER_GROUP',
            'insurance-api-audit',
          ),
          retry: { retries: 3 },
        });

        await this.consumer.connect();

        for (const topic of this.topics) {
          await this.consumer.subscribe({ topic, fromBeginning: false });
        }

        await this.consumer.run({
          eachMessage: (payload: EachMessagePayload) =>
            Promise.resolve(this.handleMessage(payload)),
        });

        console.log('[AuditEventsConsumer] Listening for audit events');
        return;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(
          `[AuditEventsConsumer] Attempt ${attempt}/${retries} failed: ${message}`,
        );
        await this.consumer.disconnect().catch(() => undefined);
        if (attempt === retries) {
          console.error(
            '[AuditEventsConsumer] Could not connect after retries.',
          );
          return;
        }
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
  }

  private handleMessage(payload: EachMessagePayload): void {
    const { topic, partition, message } = payload;
    const event = JSON.parse(message.value?.toString() ?? '{}') as Record<
      string,
      unknown
    >;
    const policyNumber = safeString(event['policyNumber']);
    const oldStatus = safeString(event['oldStatus']);
    const newStatus = safeString(event['newStatus']);
    const timestamp = safeString(event['timestamp']);

    console.log(
      `[Observer:Audit] ${topic} | ` +
        `Partition: ${partition} | ` +
        `Offset: ${message.offset} | ` +
        `Policy: ${policyNumber} | ` +
        `Old: ${oldStatus} | New: ${newStatus} | ` +
        `Timestamp: ${timestamp}`,
    );
  }
}

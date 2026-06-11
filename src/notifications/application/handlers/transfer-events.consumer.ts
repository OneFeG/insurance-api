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
export class NotificationsConsumer implements OnModuleInit, OnModuleDestroy {
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
      clientId: this.config.get<string>('KAFKA_CLIENT_ID', 'insurance-api'),
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
            'KAFKA_CONSUMER_GROUP',
            'insurance-api-notifications',
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

        console.log(
          `[NotificationsConsumer] Listening on topics: ${this.topics.join(', ')}`,
        );
        return;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(
          `[NotificationsConsumer] Attempt ${attempt}/${retries} failed: ${message}`,
        );
        await this.consumer.disconnect().catch(() => undefined);
        if (attempt === retries) {
          console.error(
            '[NotificationsConsumer] Could not connect after retries.',
          );
          return;
        }
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
    console.log('[NotificationsConsumer] Consumer disconnected');
  }

  private handleMessage(payload: EachMessagePayload): void {
    const { topic, message } = payload;
    const event = JSON.parse(message.value?.toString() ?? '{}') as Record<
      string,
      unknown
    >;

    const handlerByTopic = new Map<
      string,
      (event: Record<string, unknown>) => void
    >([
      ['policy.issued', (e) => this.onPolicyIssued(e)],
      ['policy.activated', (e) => this.onPolicyActivated(e)],
      ['policy.suspended', (e) => this.onPolicySuspended(e)],
      ['policy.reactivated', (e) => this.onPolicyReactivated(e)],
      ['policy.cancelled', (e) => this.onPolicyCancelled(e)],
    ]);

    const handler = handlerByTopic.get(topic);
    if (!handler) {
      return;
    }

    handler(event);
  }

  private onPolicyIssued(event: Record<string, unknown>): void {
    const policyNumber = safeString(event['policyNumber']);
    const customerId = safeString(event['customerId']);
    const branch = safeString(event['branch']);
    console.log(
      `[Observer:Notification] Policy ISSUED | ` +
        `Policy: ${policyNumber} | ` +
        `Customer: ${customerId} | ` +
        `Branch: ${branch}`,
    );
  }

  private onPolicyActivated(event: Record<string, unknown>): void {
    const policyNumber = safeString(event['policyNumber']);
    const customerId = safeString(event['customerId']);
    const branch = safeString(event['branch']);
    console.log(
      `[Observer:Notification] Policy ACTIVATED | ` +
        `Policy: ${policyNumber} | ` +
        `Customer: ${customerId} | ` +
        `Branch: ${branch}`,
    );
  }

  private onPolicySuspended(event: Record<string, unknown>): void {
    const policyNumber = safeString(event['policyNumber']);
    const customerId = safeString(event['customerId']);
    const branch = safeString(event['branch']);
    console.log(
      `[Observer:Notification] Policy SUSPENDED | ` +
        `Policy: ${policyNumber} | ` +
        `Customer: ${customerId} | ` +
        `Branch: ${branch}`,
    );
  }

  private onPolicyReactivated(event: Record<string, unknown>): void {
    const policyNumber = safeString(event['policyNumber']);
    const customerId = safeString(event['customerId']);
    const branch = safeString(event['branch']);
    console.log(
      `[Observer:Notification] Policy REACTIVATED | ` +
        `Policy: ${policyNumber} | ` +
        `Customer: ${customerId} | ` +
        `Branch: ${branch}`,
    );
  }

  private onPolicyCancelled(event: Record<string, unknown>): void {
    const policyNumber = safeString(event['policyNumber']);
    const customerId = safeString(event['customerId']);
    const branch = safeString(event['branch']);
    console.log(
      `[Observer:Notification] Policy CANCELLED | ` +
        `Policy: ${policyNumber} | ` +
        `Customer: ${customerId} | ` +
        `Branch: ${branch}`,
    );
  }
}

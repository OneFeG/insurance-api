import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Admin, logLevel } from 'kafkajs';
import { EventPublisherPort } from '../ports/event-publisher.port';

@Injectable()
export class KafkaEventPublisher
  extends EventPublisherPort
  implements OnModuleInit, OnModuleDestroy
{
  private kafka: Kafka;
  private producer: Producer;
  private admin: Admin;

  static readonly TOPICS = [
    'policy.issued',
    'policy.activated',
    'policy.suspended',
    'policy.reactivated',
    'policy.cancelled',
  ];

  constructor(private readonly config: ConfigService) {
    super();
    this.kafka = new Kafka({
      clientId: this.config.get<string>('KAFKA_CLIENT_ID', 'insurance-api'),
      brokers: [this.config.get<string>('KAFKA_BROKER', 'localhost:9096')],
      logLevel: logLevel.WARN,
    });
    this.producer = this.kafka.producer();
    this.admin = this.kafka.admin();
  }

  async onModuleInit(): Promise<void> {
    await this.admin.connect();
    await this.admin.createTopics({
      waitForLeaders: true,
      topics: KafkaEventPublisher.TOPICS.map((topic) => ({
        topic,
        numPartitions: 1,
        replicationFactor: 1,
      })),
    });
    await this.admin.disconnect();
    console.log(
      `[KafkaEventPublisher] Topics ensured: ${KafkaEventPublisher.TOPICS.join(', ')}`,
    );

    await this.producer.connect();
    console.log('[KafkaEventPublisher] Producer connected');
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();
    console.log('[KafkaEventPublisher] Producer disconnected');
  }

  async publish(topic: string, event: Record<string, unknown>): Promise<void> {
    const key =
      typeof event['policyId'] === 'string'
        ? event['policyId']
        : typeof event['id'] === 'string'
          ? event['id']
          : undefined;

    await this.producer.send({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(event),
          timestamp: Date.now().toString(),
        },
      ],
    });
    console.log(`[KafkaEventPublisher] Event published to "${topic}":`, event);
  }
}

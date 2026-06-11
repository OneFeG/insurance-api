export abstract class EventPublisherPort {
  abstract publish(
    topic: string,
    event: Record<string, unknown>,
  ): Promise<void>;
}

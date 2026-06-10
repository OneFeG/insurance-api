export abstract class PolicyNumberSequencerPort {
  abstract next(): Promise<string>;
}

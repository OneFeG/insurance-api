export type RiskProfileSnapshot = Record<string, unknown>;

export class PolicyRiskProfile {
  readonly value: RiskProfileSnapshot;

  constructor(value: RiskProfileSnapshot = {}) {
    this.value = Object.freeze({ ...value });
  }

  toJSON(): RiskProfileSnapshot {
    return this.value;
  }
}

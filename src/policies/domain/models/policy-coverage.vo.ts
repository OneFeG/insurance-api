import { PolicyBranch } from './policy-branch.enum';

export type CoverageSnapshot = Record<string, unknown>;

export class PolicyCoverage {
  readonly branch: PolicyBranch;
  readonly value: CoverageSnapshot;

  constructor(branch: PolicyBranch, value: CoverageSnapshot) {
    this.branch = branch;
    this.value = Object.freeze({ ...value });
    this.validate();
  }

  toJSON(): CoverageSnapshot {
    return this.value;
  }

  private validate(): void {
    const coverageAmount = this.value['coverageAmount'];
    const termMonths = this.value['termMonths'];

    if (typeof coverageAmount !== 'number' || coverageAmount <= 0) {
      throw new Error('Invalid coverageAmount');
    }
    if (typeof termMonths !== 'number' || termMonths <= 0) {
      throw new Error('Invalid termMonths');
    }

    if (
      this.branch === PolicyBranch.AUTO ||
      this.branch === PolicyBranch.HOME
    ) {
      const deductible = this.value['deductible'];
      if (typeof deductible !== 'number' || deductible < 0) {
        throw new Error('Invalid deductible');
      }
      return;
    }

    if (this.branch === PolicyBranch.LIFE) {
      const beneficiaryRequired = this.value['beneficiaryRequired'];
      if (typeof beneficiaryRequired !== 'boolean') {
        throw new Error('Invalid beneficiaryRequired');
      }
      return;
    }

    if (this.branch === PolicyBranch.HEALTH) {
      const copayRate = this.value['copayRate'];
      const waitingPeriodDays = this.value['waitingPeriodDays'];
      if (typeof copayRate !== 'number' || copayRate < 0 || copayRate > 1) {
        throw new Error('Invalid copayRate');
      }
      if (typeof waitingPeriodDays !== 'number' || waitingPeriodDays < 0) {
        throw new Error('Invalid waitingPeriodDays');
      }
    }
  }
}

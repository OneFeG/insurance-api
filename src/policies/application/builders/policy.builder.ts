import { PolicyBranch } from '../../domain/models/policy-branch.enum';
import { PolicyModel } from '../../domain/models/policy.model';
import { PolicyCoverage } from '../../domain/models/policy-coverage.vo';
import { PolicyRiskProfile } from '../../domain/models/policy-risk-profile.vo';
import { RatingStrategyName } from '../../domain/models/rating-strategy.enum';
import { QuotedState } from '../../domain/states/quoted.state';

export class PolicyBuilder {
  private id: string | null = null;
  private policyNumber: string | null = null;
  private customerId: string | null = null;
  private branch: PolicyBranch | null = null;
  private ratingStrategy: RatingStrategyName | null = null;
  private coverage: PolicyCoverage | null = null;
  private monthlyPremium: number | null = null;
  private riskProfile: PolicyRiskProfile = new PolicyRiskProfile();

  withId(id: string): this {
    this.id = id;
    return this;
  }

  withPolicyNumber(policyNumber: string): this {
    this.policyNumber = policyNumber;
    return this;
  }

  withCustomerId(customerId: string): this {
    this.customerId = customerId;
    return this;
  }

  withBranch(branch: PolicyBranch): this {
    this.branch = branch;
    return this;
  }

  withRatingStrategy(strategy: RatingStrategyName): this {
    this.ratingStrategy = strategy;
    return this;
  }

  withCoverage(coverage: PolicyCoverage): this {
    this.coverage = coverage;
    return this;
  }

  withMonthlyPremium(monthlyPremium: number): this {
    this.monthlyPremium = monthlyPremium;
    return this;
  }

  withRiskProfile(riskProfile: PolicyRiskProfile): this {
    this.riskProfile = riskProfile;
    return this;
  }

  build(): PolicyModel {
    if (!this.id) {
      throw new Error('Policy id is required');
    }
    if (!this.policyNumber) {
      throw new Error('Policy number is required');
    }
    if (!this.customerId) {
      throw new Error('Customer id is required');
    }
    if (!this.branch) {
      throw new Error('Branch is required');
    }
    if (!this.ratingStrategy) {
      throw new Error('Rating strategy is required');
    }
    if (!this.coverage) {
      throw new Error('Coverage is required');
    }
    if (this.monthlyPremium === null || Number.isNaN(this.monthlyPremium)) {
      throw new Error('Monthly premium is required');
    }
    if (this.monthlyPremium < 0) {
      throw new Error('Monthly premium must be >= 0');
    }

    const now = new Date();
    return new PolicyModel({
      id: this.id,
      policyNumber: this.policyNumber,
      customerId: this.customerId,
      branch: this.branch,
      ratingStrategy: this.ratingStrategy,
      currentState: new QuotedState(),
      coverage: this.coverage,
      monthlyPremium: this.monthlyPremium,
      riskProfile: this.riskProfile,
      createdAt: now,
      updatedAt: now,
    });
  }
}

import { PolicyBranch } from './policy-branch.enum';
import { PolicyStatus } from './policy-status.enum';
import { RatingStrategyName } from './rating-strategy.enum';
import { PolicyCoverage } from './policy-coverage.vo';
import { PolicyRiskProfile } from './policy-risk-profile.vo';
import { PolicyStatePort } from '../ports/policy-state.port';

export interface PolicyProps {
  id: string;
  policyNumber: string;
  customerId: string;
  branch: PolicyBranch;
  ratingStrategy: RatingStrategyName;
  currentState: PolicyStatePort;
  coverage: PolicyCoverage;
  monthlyPremium: number;
  riskProfile: PolicyRiskProfile;
  createdAt: Date;
  updatedAt: Date;
}

export class PolicyModel {
  readonly id: string;
  readonly policyNumber: string;
  readonly customerId: string;
  readonly branch: PolicyBranch;
  readonly ratingStrategy: RatingStrategyName;
  readonly currentState: PolicyStatePort;
  readonly coverage: PolicyCoverage;
  readonly monthlyPremium: number;
  readonly riskProfile: PolicyRiskProfile;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: PolicyProps) {
    this.id = props.id;
    this.policyNumber = props.policyNumber;
    this.customerId = props.customerId;
    this.branch = props.branch;
    this.ratingStrategy = props.ratingStrategy;
    this.currentState = props.currentState;
    this.coverage = props.coverage;
    this.monthlyPremium = props.monthlyPremium;
    this.riskProfile = props.riskProfile;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  get status(): PolicyStatus {
    return this.currentState.status;
  }

  transitionTo(targetStatus: PolicyStatus): PolicyModel {
    return this.withState(this.currentState.transitionTo(targetStatus));
  }

  private withState(nextState: PolicyStatePort): PolicyModel {
    if (nextState === this.currentState) {
      return this;
    }
    return new PolicyModel({
      id: this.id,
      policyNumber: this.policyNumber,
      customerId: this.customerId,
      branch: this.branch,
      ratingStrategy: this.ratingStrategy,
      coverage: this.coverage,
      monthlyPremium: this.monthlyPremium,
      riskProfile: this.riskProfile,
      createdAt: this.createdAt,
      currentState: nextState,
      updatedAt: new Date(),
    });
  }
}

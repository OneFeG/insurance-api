import { PolicyModel } from '../../domain/models/policy.model';
import { PolicyBranch } from '../../domain/models/policy-branch.enum';
import { PolicyStatus } from '../../domain/models/policy-status.enum';
import { RatingStrategyName } from '../../domain/models/rating-strategy.enum';

export class PolicyResponseDto {
  id: string;
  policyNumber: string;
  customerId: string;
  branch: PolicyBranch;
  ratingStrategy: RatingStrategyName;
  status: PolicyStatus;
  coverage: Record<string, unknown>;
  monthlyPremium: number;
  riskProfile: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(policy: PolicyModel): PolicyResponseDto {
    return {
      id: policy.id,
      policyNumber: policy.policyNumber,
      customerId: policy.customerId,
      branch: policy.branch,
      ratingStrategy: policy.ratingStrategy,
      status: policy.status,
      coverage: policy.coverage.toJSON(),
      monthlyPremium: policy.monthlyPremium,
      riskProfile: policy.riskProfile.toJSON(),
      createdAt: policy.createdAt,
      updatedAt: policy.updatedAt,
    };
  }
}

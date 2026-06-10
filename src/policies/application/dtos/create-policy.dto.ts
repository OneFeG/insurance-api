import { IsEnum, IsObject, IsOptional, IsUUID } from 'class-validator';
import { PolicyBranch } from '../../domain/models/policy-branch.enum';
import { RatingStrategyName } from '../../domain/models/rating-strategy.enum';

export class CreatePolicyDto {
  @IsUUID()
  customerId: string;

  @IsEnum(PolicyBranch)
  branch: PolicyBranch;

  @IsEnum(RatingStrategyName)
  ratingStrategy: RatingStrategyName;

  @IsOptional()
  @IsObject()
  riskProfile?: Record<string, unknown>;
}

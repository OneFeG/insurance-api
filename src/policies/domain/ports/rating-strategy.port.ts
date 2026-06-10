import { RatingStrategyName } from '../models/rating-strategy.enum';
import { PolicyRiskProfile } from '../models/policy-risk-profile.vo';

export interface RatingStrategyPort {
  getName(): RatingStrategyName;
  validate(riskProfile: PolicyRiskProfile): void;
  calculatePremium(
    baseMonthlyPremium: number,
    riskProfile: PolicyRiskProfile,
  ): number;
}

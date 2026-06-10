import { Injectable } from '@nestjs/common';
import { RatingStrategyName } from '../../domain/models/rating-strategy.enum';
import { PolicyRiskProfile } from '../../domain/models/policy-risk-profile.vo';
import { RatingStrategyPort } from '../../domain/ports/rating-strategy.port';

@Injectable()
export class StandardRatingStrategy implements RatingStrategyPort {
  getName(): RatingStrategyName {
    return RatingStrategyName.STANDARD;
  }

  validate(riskProfile: PolicyRiskProfile): void {
    void riskProfile;
  }

  calculatePremium(
    baseMonthlyPremium: number,
    riskProfile: PolicyRiskProfile,
  ): number {
    void riskProfile;
    return baseMonthlyPremium;
  }
}

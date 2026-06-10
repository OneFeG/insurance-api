import { Injectable } from '@nestjs/common';
import { RatingStrategyName } from '../../domain/models/rating-strategy.enum';
import { PolicyRiskProfile } from '../../domain/models/policy-risk-profile.vo';
import { RatingStrategyPort } from '../../domain/ports/rating-strategy.port';
import { InvalidRiskProfileException } from '../../domain/exceptions/invalid-risk-profile.exception';

@Injectable()
export class LoyaltyRatingStrategy implements RatingStrategyPort {
  getName(): RatingStrategyName {
    return RatingStrategyName.LOYALTY;
  }

  validate(riskProfile: PolicyRiskProfile): void {
    const customerSince = riskProfile.value['customerSince'];
    if (typeof customerSince !== 'number' || Number.isNaN(customerSince)) {
      throw new InvalidRiskProfileException(
        'riskProfile.customerSince (year) is required for LOYALTY strategy',
      );
    }

    const currentYear = new Date().getFullYear();
    const tenureYears = currentYear - customerSince;
    if (tenureYears < 2) {
      throw new InvalidRiskProfileException(
        'Customer tenure must be at least 2 years for LOYALTY strategy',
      );
    }
  }

  calculatePremium(
    baseMonthlyPremium: number,
    riskProfile: PolicyRiskProfile,
  ): number {
    void riskProfile;
    return Math.round(baseMonthlyPremium * 0.85);
  }
}

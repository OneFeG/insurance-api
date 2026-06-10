import { Injectable } from '@nestjs/common';
import { RatingStrategyName } from '../../domain/models/rating-strategy.enum';
import { PolicyRiskProfile } from '../../domain/models/policy-risk-profile.vo';
import { RatingStrategyPort } from '../../domain/ports/rating-strategy.port';
import { InvalidRiskProfileException } from '../../domain/exceptions/invalid-risk-profile.exception';

@Injectable()
export class RiskBasedRatingStrategy implements RatingStrategyPort {
  getName(): RatingStrategyName {
    return RatingStrategyName.RISK_BASED;
  }

  validate(riskProfile: PolicyRiskProfile): void {
    const riskScore = riskProfile.value['riskScore'];
    if (typeof riskScore !== 'number' || Number.isNaN(riskScore)) {
      throw new InvalidRiskProfileException(
        'riskProfile.riskScore is required for RISK_BASED strategy',
      );
    }
    if (riskScore < 0 || riskScore > 100) {
      throw new InvalidRiskProfileException(
        'riskProfile.riskScore must be between 0 and 100',
      );
    }
  }

  calculatePremium(
    baseMonthlyPremium: number,
    riskProfile: PolicyRiskProfile,
  ): number {
    const riskScore = riskProfile.value['riskScore'] as number;
    return Math.round(baseMonthlyPremium * (1 + riskScore / 100));
  }
}

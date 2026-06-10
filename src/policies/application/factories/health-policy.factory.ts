import { Injectable } from '@nestjs/common';
import { PolicyBranch } from '../../domain/models/policy-branch.enum';
import { PolicyCoverage } from '../../domain/models/policy-coverage.vo';
import { PolicyFactoryPort } from '../../domain/ports/policy-factory.port';

@Injectable()
export class HealthPolicyFactory implements PolicyFactoryPort {
  getBranch(): PolicyBranch {
    return PolicyBranch.HEALTH;
  }

  getBaseMonthlyPremium(): number {
    return 180_000;
  }

  createDefaultCoverage(): PolicyCoverage {
    return new PolicyCoverage(PolicyBranch.HEALTH, {
      coverageAmount: 100_000_000,
      copayRate: 0.2,
      waitingPeriodDays: 30,
      termMonths: 12,
    });
  }
}

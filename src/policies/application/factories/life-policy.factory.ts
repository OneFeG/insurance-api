import { Injectable } from '@nestjs/common';
import { PolicyBranch } from '../../domain/models/policy-branch.enum';
import { PolicyCoverage } from '../../domain/models/policy-coverage.vo';
import { PolicyFactoryPort } from '../../domain/ports/policy-factory.port';

@Injectable()
export class LifePolicyFactory implements PolicyFactoryPort {
  getBranch(): PolicyBranch {
    return PolicyBranch.LIFE;
  }

  getBaseMonthlyPremium(): number {
    return 90_000;
  }

  createDefaultCoverage(): PolicyCoverage {
    return new PolicyCoverage(PolicyBranch.LIFE, {
      coverageAmount: 200_000_000,
      beneficiaryRequired: true,
      termMonths: 12,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PolicyBranch } from '../../domain/models/policy-branch.enum';
import { PolicyCoverage } from '../../domain/models/policy-coverage.vo';
import { PolicyFactoryPort } from '../../domain/ports/policy-factory.port';

@Injectable()
export class HomePolicyFactory implements PolicyFactoryPort {
  getBranch(): PolicyBranch {
    return PolicyBranch.HOME;
  }

  getBaseMonthlyPremium(): number {
    return 75_000;
  }

  createDefaultCoverage(): PolicyCoverage {
    return new PolicyCoverage(PolicyBranch.HOME, {
      coverageAmount: 150_000_000,
      deductible: 2_000_000,
      termMonths: 12,
    });
  }
}

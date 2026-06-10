import { Injectable } from '@nestjs/common';
import { PolicyBranch } from '../../domain/models/policy-branch.enum';
import { PolicyCoverage } from '../../domain/models/policy-coverage.vo';
import { PolicyFactoryPort } from '../../domain/ports/policy-factory.port';

@Injectable()
export class AutoPolicyFactory implements PolicyFactoryPort {
  getBranch(): PolicyBranch {
    return PolicyBranch.AUTO;
  }

  getBaseMonthlyPremium(): number {
    return 120_000;
  }

  createDefaultCoverage(): PolicyCoverage {
    return new PolicyCoverage(PolicyBranch.AUTO, {
      coverageAmount: 80_000_000,
      deductible: 1_000_000,
      termMonths: 12,
    });
  }
}

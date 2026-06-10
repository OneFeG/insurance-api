import { PolicyBranch } from '../models/policy-branch.enum';
import { PolicyCoverage } from '../models/policy-coverage.vo';

export interface PolicyFactoryPort {
  getBranch(): PolicyBranch;
  getBaseMonthlyPremium(): number;
  createDefaultCoverage(): PolicyCoverage;
}

import { PolicyBranch } from '../models/policy-branch.enum';

export class UnsupportedBranchException extends Error {
  readonly branch: PolicyBranch;

  constructor(branch: PolicyBranch) {
    super(`Unsupported policy branch "${branch}"`);
    this.branch = branch;
  }
}

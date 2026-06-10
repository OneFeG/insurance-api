import { PolicyStatus } from '../models/policy-status.enum';

export interface PolicyStatePort {
  readonly status: PolicyStatus;
  transitionTo(target: PolicyStatus): PolicyStatePort;
}

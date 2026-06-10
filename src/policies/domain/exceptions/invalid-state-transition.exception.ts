import { PolicyStatus } from '../models/policy-status.enum';

export class InvalidStateTransitionException extends Error {
  readonly currentStatus: PolicyStatus;
  readonly targetStatus: PolicyStatus;

  constructor(currentStatus: PolicyStatus, targetStatus: PolicyStatus) {
    super(`Invalid transition "${currentStatus}" -> "${targetStatus}"`);
    this.currentStatus = currentStatus;
    this.targetStatus = targetStatus;
  }
}

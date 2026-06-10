import { PolicyStatus } from '../models/policy-status.enum';
import { InvalidStateTransitionException } from '../exceptions/invalid-state-transition.exception';
import { PolicyStatePort } from '../ports/policy-state.port';

export class CancelledState implements PolicyStatePort {
  readonly status = PolicyStatus.CANCELLED;

  transitionTo(target: PolicyStatus): PolicyStatePort {
    if (target === this.status) {
      return this;
    }
    throw new InvalidStateTransitionException(this.status, target);
  }
}

import { PolicyStatus } from '../models/policy-status.enum';
import { InvalidStateTransitionException } from '../exceptions/invalid-state-transition.exception';
import { PolicyStatePort } from '../ports/policy-state.port';
import { SuspendedState } from './suspended.state';
import { CancelledState } from './cancelled.state';

export class ActiveState implements PolicyStatePort {
  readonly status = PolicyStatus.ACTIVE;

  transitionTo(target: PolicyStatus): PolicyStatePort {
    if (target === this.status) {
      return this;
    }
    if (target === PolicyStatus.SUSPENDED) {
      return new SuspendedState();
    }
    if (target === PolicyStatus.CANCELLED) {
      return new CancelledState();
    }
    throw new InvalidStateTransitionException(this.status, target);
  }
}

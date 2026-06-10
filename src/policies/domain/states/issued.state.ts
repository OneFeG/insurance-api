import { PolicyStatus } from '../models/policy-status.enum';
import { InvalidStateTransitionException } from '../exceptions/invalid-state-transition.exception';
import { PolicyStatePort } from '../ports/policy-state.port';
import { ActiveState } from './active.state';
import { CancelledState } from './cancelled.state';

export class IssuedState implements PolicyStatePort {
  readonly status = PolicyStatus.ISSUED;

  transitionTo(target: PolicyStatus): PolicyStatePort {
    if (target === this.status) {
      return this;
    }
    if (target === PolicyStatus.ACTIVE) {
      return new ActiveState();
    }
    if (target === PolicyStatus.CANCELLED) {
      return new CancelledState();
    }
    throw new InvalidStateTransitionException(this.status, target);
  }
}

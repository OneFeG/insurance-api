import { PolicyStatus } from '../models/policy-status.enum';
import { InvalidStateTransitionException } from '../exceptions/invalid-state-transition.exception';
import { PolicyStatePort } from '../ports/policy-state.port';
import { IssuedState } from './issued.state';
import { CancelledState } from './cancelled.state';

export class QuotedState implements PolicyStatePort {
  readonly status = PolicyStatus.QUOTED;

  transitionTo(target: PolicyStatus): PolicyStatePort {
    if (target === this.status) {
      return this;
    }
    if (target === PolicyStatus.ISSUED) {
      return new IssuedState();
    }
    if (target === PolicyStatus.CANCELLED) {
      return new CancelledState();
    }
    throw new InvalidStateTransitionException(this.status, target);
  }
}

import { BankProductStatus } from '../models/bank-product-status.enum';
import { InvalidStateTransitionException } from '../exceptions/invalid-state-transition.exception';
import { BankProductStatePort } from './bank-product-state.port';
import { SuspendedState } from './suspended.state';
import { CancelledState } from './cancelled.state';

export class ActiveState implements BankProductStatePort {
  readonly status = BankProductStatus.ACTIVE;

  activate(): BankProductStatePort {
    return this;
  }

  suspend(): BankProductStatePort {
    return new SuspendedState();
  }

  reactivate(): BankProductStatePort {
    throw new InvalidStateTransitionException(this.status, 'reactivate');
  }

  cancel(): BankProductStatePort {
    return new CancelledState();
  }
}

import { BankProductStatus } from '../models/bank-product-status.enum';
import { InvalidStateTransitionException } from '../exceptions/invalid-state-transition.exception';
import { BankProductStatePort } from './bank-product-state.port';
import { ActiveState } from './active.state';
import { CancelledState } from './cancelled.state';

export class SuspendedState implements BankProductStatePort {
  readonly status = BankProductStatus.SUSPENDED;

  activate(): BankProductStatePort {
    throw new InvalidStateTransitionException(this.status, 'activate');
  }

  suspend(): BankProductStatePort {
    return this;
  }

  reactivate(): BankProductStatePort {
    return new ActiveState();
  }

  cancel(): BankProductStatePort {
    return new CancelledState();
  }
}

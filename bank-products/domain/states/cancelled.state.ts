import { BankProductStatus } from '../models/bank-product-status.enum';
import { InvalidStateTransitionException } from '../exceptions/invalid-state-transition.exception';
import { BankProductStatePort } from './bank-product-state.port';

export class CancelledState implements BankProductStatePort {
  readonly status = BankProductStatus.CANCELLED;

  activate(): BankProductStatePort {
    throw new InvalidStateTransitionException(this.status, 'activate');
  }

  suspend(): BankProductStatePort {
    throw new InvalidStateTransitionException(this.status, 'suspend');
  }

  reactivate(): BankProductStatePort {
    throw new InvalidStateTransitionException(this.status, 'reactivate');
  }

  cancel(): BankProductStatePort {
    throw new InvalidStateTransitionException(this.status, 'cancel');
  }
}

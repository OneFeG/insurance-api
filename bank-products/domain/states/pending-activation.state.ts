import { BankProductStatus } from '../models/bank-product-status.enum';
import { InvalidStateTransitionException } from '../exceptions/invalid-state-transition.exception';
import { BankProductStatePort } from './bank-product-state.port';
import { ActiveState } from './active.state';
import { CancelledState } from './cancelled.state';

export class PendingActivationState implements BankProductStatePort {
  readonly status = BankProductStatus.PENDING_ACTIVATION;

  activate(): BankProductStatePort {
    return new ActiveState();
  }

  suspend(): BankProductStatePort {
    throw new InvalidStateTransitionException(this.status, 'suspend');
  }

  reactivate(): BankProductStatePort {
    throw new InvalidStateTransitionException(this.status, 'reactivate');
  }

  cancel(): BankProductStatePort {
    return new CancelledState();
  }
}

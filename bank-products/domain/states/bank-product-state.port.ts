import { BankProductStatus } from '../models/bank-product-status.enum';

export interface BankProductStatePort {
  readonly status: BankProductStatus;
  activate(): BankProductStatePort;
  suspend(): BankProductStatePort;
  reactivate(): BankProductStatePort;
  cancel(): BankProductStatePort;
}

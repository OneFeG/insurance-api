import { BadRequestException } from '@nestjs/common';
import { BankProductStatus } from '../models/bank-product-status.enum';

export class InvalidStateTransitionException extends BadRequestException {
  constructor(
    from: BankProductStatus,
    attemptedTransition: string,
  ) {
    super(
      `Cannot ${attemptedTransition} a bank product in state ${from}.`,
    );
  }
}

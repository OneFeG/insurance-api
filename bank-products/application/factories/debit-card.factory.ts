import { Injectable } from '@nestjs/common';
import { BankProductFactoryPort } from '../../domain/ports/bank-product-factory.port';
import { BankProductType } from '../../domain/models/bank-product-type.enum';
import { BankProductConfiguration } from '../../domain/models/bank-product-configuration.vo';

@Injectable()
export class DebitCardFactory extends BankProductFactoryPort {
  getProductType(): BankProductType {
    return BankProductType.DEBIT_CARD;
  }

  createDefaultConfiguration(): BankProductConfiguration {
    return new BankProductConfiguration({
      dailyWithdrawalLimit: 1_500_000,
    });
  }
}

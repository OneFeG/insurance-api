import { Injectable } from '@nestjs/common';
import { BankProductFactoryPort } from '../../domain/ports/bank-product-factory.port';
import { BankProductType } from '../../domain/models/bank-product-type.enum';
import { BankProductConfiguration } from '../../domain/models/bank-product-configuration.vo';

@Injectable()
export class SavingsAccountFactory extends BankProductFactoryPort {
  getProductType(): BankProductType {
    return BankProductType.SAVINGS_ACCOUNT;
  }

  createDefaultConfiguration(): BankProductConfiguration {
    return new BankProductConfiguration({
      dailyWithdrawalLimit: 2_000_000,
      annualInterestRate: 0.03,
      minimumBalance: 50_000,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { BankProductFactoryPort } from '../../domain/ports/bank-product-factory.port';
import { BankProductType } from '../../domain/models/bank-product-type.enum';
import { BankProductConfiguration } from '../../domain/models/bank-product-configuration.vo';

@Injectable()
export class CreditCardFactory extends BankProductFactoryPort {
  getProductType(): BankProductType {
    return BankProductType.CREDIT_CARD;
  }

  createDefaultConfiguration(): BankProductConfiguration {
    return new BankProductConfiguration({
      creditLimit: 5_000_000,
      monthlyInterestRate: 0.018,
    });
  }
}

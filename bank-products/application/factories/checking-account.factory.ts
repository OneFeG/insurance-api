import { Injectable } from '@nestjs/common';
import { BankProductFactoryPort } from '../../domain/ports/bank-product-factory.port';
import { BankProductType } from '../../domain/models/bank-product-type.enum';
import { BankProductConfiguration } from '../../domain/models/bank-product-configuration.vo';

@Injectable()
export class CheckingAccountFactory extends BankProductFactoryPort {
  getProductType(): BankProductType {
    return BankProductType.CHECKING_ACCOUNT;
  }

  createDefaultConfiguration(): BankProductConfiguration {
    return new BankProductConfiguration({
      dailyWithdrawalLimit: 5_000_000,
      minimumBalance: 0,
    });
  }
}

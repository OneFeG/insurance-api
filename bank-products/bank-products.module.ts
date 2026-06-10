import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { EventsModule } from '../shared/events/events.module';

import { BankProductType } from './domain/models/bank-product-type.enum';
import { BankProductRepositoryPort } from './domain/ports/bank-product-repository.port';
import { BankProductFactoryPort } from './domain/ports/bank-product-factory.port';

import { BankProductTypeormEntity } from './infrastructure/persistence/bank-product.typeorm-entity';
import { BankProductTypeormRepository } from './infrastructure/persistence/bank-product.typeorm-repository';
import { BankProductMapper } from './infrastructure/persistence/bank-product.mapper';
import { BankProductController } from './infrastructure/controllers/bank-product.controller';

import { SavingsAccountFactory } from './application/factories/savings-account.factory';
import { CheckingAccountFactory } from './application/factories/checking-account.factory';
import { DebitCardFactory } from './application/factories/debit-card.factory';
import { CreditCardFactory } from './application/factories/credit-card.factory';

import {
  CreateBankProductUseCase,
  BANK_PRODUCT_FACTORIES,
} from './application/use-cases/create-bank-product.use-case';
import { ChangeBankProductStatusUseCase } from './application/use-cases/change-bank-product-status.use-case';
import { FindBankProductUseCase } from './application/use-cases/find-bank-product.use-case';
import { FindUserBankProductsUseCase } from './application/use-cases/find-user-bank-products.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([BankProductTypeormEntity]),
    UsersModule,
    EventsModule,
  ],
  controllers: [BankProductController],
  providers: [
    BankProductMapper,
    {
      provide: BankProductRepositoryPort,
      useClass: BankProductTypeormRepository,
    },

    // Factory Method (GoF): one concrete factory per product type
    SavingsAccountFactory,
    CheckingAccountFactory,
    DebitCardFactory,
    CreditCardFactory,

    // Map<BankProductType, Factory> — Open/Closed selection mechanism
    {
      provide: BANK_PRODUCT_FACTORIES,
      useFactory: (
        savings: SavingsAccountFactory,
        checking: CheckingAccountFactory,
        debit: DebitCardFactory,
        credit: CreditCardFactory,
      ): Map<BankProductType, BankProductFactoryPort> =>
        new Map<BankProductType, BankProductFactoryPort>([
          [BankProductType.SAVINGS_ACCOUNT, savings],
          [BankProductType.CHECKING_ACCOUNT, checking],
          [BankProductType.DEBIT_CARD, debit],
          [BankProductType.CREDIT_CARD, credit],
        ]),
      inject: [
        SavingsAccountFactory,
        CheckingAccountFactory,
        DebitCardFactory,
        CreditCardFactory,
      ],
    },

    CreateBankProductUseCase,
    ChangeBankProductStatusUseCase,
    FindBankProductUseCase,
    FindUserBankProductsUseCase,
  ],
})
export class BankProductsModule {}

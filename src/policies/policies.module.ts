import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { PolicyController } from './infrastructure/controllers/policy.controller';
import { PolicyTypeormEntity } from './infrastructure/persistence/policy.typeorm-entity';
import { PolicyMapper } from './infrastructure/persistence/policy.mapper';
import { PolicyTypeormRepository } from './infrastructure/persistence/policy.typeorm-repository';
import { PolicyRepositoryPort } from './domain/ports/policy-repository.port';
import { POLICY_FACTORIES, RATING_STRATEGIES } from './policies.tokens';
import { AutoPolicyFactory } from './application/factories/auto-policy.factory';
import { LifePolicyFactory } from './application/factories/life-policy.factory';
import { HomePolicyFactory } from './application/factories/home-policy.factory';
import { HealthPolicyFactory } from './application/factories/health-policy.factory';
import { PolicyBranch } from './domain/models/policy-branch.enum';
import { PolicyFactoryPort } from './domain/ports/policy-factory.port';
import { StandardRatingStrategy } from './application/strategies/standard-rating.strategy';
import { RiskBasedRatingStrategy } from './application/strategies/risk-based-rating.strategy';
import { LoyaltyRatingStrategy } from './application/strategies/loyalty-rating.strategy';
import { RatingStrategyName } from './domain/models/rating-strategy.enum';
import { RatingStrategyPort } from './domain/ports/rating-strategy.port';
import { PolicyNumberSequencerPort } from './domain/ports/policy-number-sequencer.port';
import { PolicyNumberSequencer } from './infrastructure/sequence/policy-number-sequencer';
import { CreatePolicyUseCase } from './application/use-cases/create-policy.use-case';
import { FindPolicyUseCase } from './application/use-cases/find-policy.use-case';
import { FindCustomerPoliciesUseCase } from './application/use-cases/find-customer-policies.use-case';
import { ChangePolicyStatusUseCase } from './application/use-cases/change-policy-status.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([PolicyTypeormEntity]), UsersModule],
  controllers: [PolicyController],
  providers: [
    PolicyMapper,
    {
      provide: PolicyRepositoryPort,
      useClass: PolicyTypeormRepository,
    },
    {
      provide: PolicyNumberSequencerPort,
      useClass: PolicyNumberSequencer,
    },
    AutoPolicyFactory,
    LifePolicyFactory,
    HomePolicyFactory,
    HealthPolicyFactory,
    {
      provide: POLICY_FACTORIES,
      useFactory: (
        auto: AutoPolicyFactory,
        life: LifePolicyFactory,
        home: HomePolicyFactory,
        health: HealthPolicyFactory,
      ): Map<PolicyBranch, PolicyFactoryPort> =>
        new Map<PolicyBranch, PolicyFactoryPort>([
          [PolicyBranch.AUTO, auto],
          [PolicyBranch.LIFE, life],
          [PolicyBranch.HOME, home],
          [PolicyBranch.HEALTH, health],
        ]),
      inject: [
        AutoPolicyFactory,
        LifePolicyFactory,
        HomePolicyFactory,
        HealthPolicyFactory,
      ],
    },
    StandardRatingStrategy,
    RiskBasedRatingStrategy,
    LoyaltyRatingStrategy,
    {
      provide: RATING_STRATEGIES,
      useFactory: (
        standard: StandardRatingStrategy,
        riskBased: RiskBasedRatingStrategy,
        loyalty: LoyaltyRatingStrategy,
      ): Map<RatingStrategyName, RatingStrategyPort> =>
        new Map<RatingStrategyName, RatingStrategyPort>([
          [RatingStrategyName.STANDARD, standard],
          [RatingStrategyName.RISK_BASED, riskBased],
          [RatingStrategyName.LOYALTY, loyalty],
        ]),
      inject: [
        StandardRatingStrategy,
        RiskBasedRatingStrategy,
        LoyaltyRatingStrategy,
      ],
    },
    CreatePolicyUseCase,
    FindPolicyUseCase,
    FindCustomerPoliciesUseCase,
    ChangePolicyStatusUseCase,
  ],
})
export class PoliciesModule {}

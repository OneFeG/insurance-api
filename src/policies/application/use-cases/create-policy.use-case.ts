import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UserRepositoryPort } from '../../../users/domain/ports/user-repository.port';
import { PolicyRepositoryPort } from '../../domain/ports/policy-repository.port';
import { PolicyNumberSequencerPort } from '../../domain/ports/policy-number-sequencer.port';
import { POLICY_FACTORIES, RATING_STRATEGIES } from '../../policies.tokens';
import { PolicyBranch } from '../../domain/models/policy-branch.enum';
import { PolicyFactoryPort } from '../../domain/ports/policy-factory.port';
import { RatingStrategyName } from '../../domain/models/rating-strategy.enum';
import { RatingStrategyPort } from '../../domain/ports/rating-strategy.port';
import { UnsupportedBranchException } from '../../domain/exceptions/unsupported-branch.exception';
import { UnsupportedRatingStrategyException } from '../../domain/exceptions/unsupported-rating-strategy.exception';
import { InactiveCustomerException } from '../../domain/exceptions/inactive-customer.exception';
import { PolicyRiskProfile } from '../../domain/models/policy-risk-profile.vo';
import { PolicyBuilder } from '../builders/policy.builder';
import { CreatePolicyDto } from '../dtos/create-policy.dto';
import { PolicyResponseDto } from '../dtos/policy-response.dto';

@Injectable()
export class CreatePolicyUseCase {
  constructor(
    private readonly usersRepository: UserRepositoryPort,
    private readonly policyRepository: PolicyRepositoryPort,
    private readonly policyNumberSequencer: PolicyNumberSequencerPort,
    @Inject(POLICY_FACTORIES)
    private readonly factories: Map<PolicyBranch, PolicyFactoryPort>,
    @Inject(RATING_STRATEGIES)
    private readonly strategies: Map<RatingStrategyName, RatingStrategyPort>,
  ) {}

  async execute(dto: CreatePolicyDto): Promise<PolicyResponseDto> {
    const customer = await this.usersRepository.findById(dto.customerId);
    if (!customer || !customer.isActive) {
      throw new InactiveCustomerException(dto.customerId);
    }

    const factory = this.factories.get(dto.branch);
    if (!factory) {
      throw new UnsupportedBranchException(dto.branch);
    }

    const strategy = this.strategies.get(dto.ratingStrategy);
    if (!strategy) {
      throw new UnsupportedRatingStrategyException(dto.ratingStrategy);
    }

    const coverage = factory.createDefaultCoverage();
    const baseMonthlyPremium = factory.getBaseMonthlyPremium();
    const riskProfile = new PolicyRiskProfile(dto.riskProfile ?? {});

    strategy.validate(riskProfile);
    const monthlyPremium = strategy.calculatePremium(
      baseMonthlyPremium,
      riskProfile,
    );

    const policyNumber = await this.policyNumberSequencer.next();
    const policy = new PolicyBuilder()
      .withId(uuidv4())
      .withPolicyNumber(policyNumber)
      .withCustomerId(dto.customerId)
      .withBranch(dto.branch)
      .withRatingStrategy(dto.ratingStrategy)
      .withCoverage(coverage)
      .withRiskProfile(riskProfile)
      .withMonthlyPremium(monthlyPremium)
      .build();

    const saved = await this.policyRepository.save(policy);
    return PolicyResponseDto.fromDomain(saved);
  }
}

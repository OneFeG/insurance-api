import { Injectable } from '@nestjs/common';
import { PolicyModel } from '../../domain/models/policy.model';
import { PolicyCoverage } from '../../domain/models/policy-coverage.vo';
import { PolicyRiskProfile } from '../../domain/models/policy-risk-profile.vo';
import { PolicyStatus } from '../../domain/models/policy-status.enum';
import { PolicyTypeormEntity } from './policy.typeorm-entity';
import { PolicyStatePort } from '../../domain/ports/policy-state.port';
import { QuotedState } from '../../domain/states/quoted.state';
import { IssuedState } from '../../domain/states/issued.state';
import { ActiveState } from '../../domain/states/active.state';
import { SuspendedState } from '../../domain/states/suspended.state';
import { CancelledState } from '../../domain/states/cancelled.state';

@Injectable()
export class PolicyMapper {
  toDomain(entity: PolicyTypeormEntity): PolicyModel {
    return new PolicyModel({
      id: entity.id,
      policyNumber: entity.policyNumber,
      customerId: entity.customerId,
      branch: entity.branch,
      ratingStrategy: entity.ratingStrategy,
      currentState: this.stateFromStatus(entity.status),
      coverage: new PolicyCoverage(entity.branch, entity.coverage),
      monthlyPremium: entity.monthlyPremium,
      riskProfile: new PolicyRiskProfile(entity.riskProfile),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  toPersistence(model: PolicyModel): PolicyTypeormEntity {
    const entity = new PolicyTypeormEntity();
    entity.id = model.id;
    entity.policyNumber = model.policyNumber;
    entity.customerId = model.customerId;
    entity.branch = model.branch;
    entity.ratingStrategy = model.ratingStrategy;
    entity.status = model.status;
    entity.coverage = model.coverage.toJSON();
    entity.monthlyPremium = model.monthlyPremium;
    entity.riskProfile = model.riskProfile.toJSON();
    entity.createdAt = model.createdAt;
    entity.updatedAt = model.updatedAt;
    return entity;
  }

  private stateFromStatus(status: PolicyStatus): PolicyStatePort {
    switch (status) {
      case PolicyStatus.QUOTED:
        return new QuotedState();
      case PolicyStatus.ISSUED:
        return new IssuedState();
      case PolicyStatus.ACTIVE:
        return new ActiveState();
      case PolicyStatus.SUSPENDED:
        return new SuspendedState();
      case PolicyStatus.CANCELLED:
        return new CancelledState();
    }
    throw new Error(`Unsupported policy status "${status as string}"`);
  }
}

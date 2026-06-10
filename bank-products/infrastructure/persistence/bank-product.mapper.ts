import { Injectable } from '@nestjs/common';
import { BankProductModel } from '../../domain/models/bank-product.model';
import { BankProductType } from '../../domain/models/bank-product-type.enum';
import { BankProductStatus } from '../../domain/models/bank-product-status.enum';
import { BankProductConfiguration } from '../../domain/models/bank-product-configuration.vo';
import { BankProductStatePort } from '../../domain/states/bank-product-state.port';
import { PendingActivationState } from '../../domain/states/pending-activation.state';
import { ActiveState } from '../../domain/states/active.state';
import { SuspendedState } from '../../domain/states/suspended.state';
import { CancelledState } from '../../domain/states/cancelled.state';
import { BankProductTypeormEntity } from './bank-product.typeorm-entity';

@Injectable()
export class BankProductMapper {
  private readonly stateByStatus: Record<BankProductStatus, () => BankProductStatePort> = {
    [BankProductStatus.PENDING_ACTIVATION]: () => new PendingActivationState(),
    [BankProductStatus.ACTIVE]: () => new ActiveState(),
    [BankProductStatus.SUSPENDED]: () => new SuspendedState(),
    [BankProductStatus.CANCELLED]: () => new CancelledState(),
  };

  toDomain(entity: BankProductTypeormEntity): BankProductModel {
    const status = entity.status as BankProductStatus;
    const stateFactory = this.stateByStatus[status];
    if (!stateFactory) {
      throw new Error(`Unknown bank product status persisted: ${entity.status}`);
    }
    return new BankProductModel({
      id: entity.id,
      userId: entity.user_id,
      type: entity.type as BankProductType,
      currentState: stateFactory(),
      configuration: new BankProductConfiguration(entity.configuration ?? {}),
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
    });
  }

  toPersistence(model: BankProductModel): BankProductTypeormEntity {
    const entity = new BankProductTypeormEntity();
    entity.id = model.id;
    entity.user_id = model.userId;
    entity.type = model.type;
    entity.status = model.currentState.status;
    entity.configuration = model.configuration.toJSON();
    entity.created_at = model.createdAt;
    entity.updated_at = model.updatedAt;
    return entity;
  }
}

import { BankProductType } from './bank-product-type.enum';
import { BankProductStatus } from './bank-product-status.enum';
import { BankProductConfiguration } from './bank-product-configuration.vo';
import { BankProductStatePort } from '../states/bank-product-state.port';

export interface BankProductProps {
  id: string;
  userId: string;
  type: BankProductType;
  currentState: BankProductStatePort;
  configuration: BankProductConfiguration;
  createdAt: Date;
  updatedAt: Date;
}

export class BankProductModel {
  readonly id: string;
  readonly userId: string;
  readonly type: BankProductType;
  readonly currentState: BankProductStatePort;
  readonly configuration: BankProductConfiguration;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: BankProductProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.type = props.type;
    this.currentState = props.currentState;
    this.configuration = props.configuration;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  get status(): BankProductStatus {
    return this.currentState.status;
  }

  activate(): BankProductModel {
    return this.withState(this.currentState.activate());
  }

  suspend(): BankProductModel {
    return this.withState(this.currentState.suspend());
  }

  reactivate(): BankProductModel {
    return this.withState(this.currentState.reactivate());
  }

  cancel(): BankProductModel {
    return this.withState(this.currentState.cancel());
  }

  private withState(nextState: BankProductStatePort): BankProductModel {
    if (nextState === this.currentState) {
      return this;
    }
    return new BankProductModel({
      id: this.id,
      userId: this.userId,
      type: this.type,
      configuration: this.configuration,
      createdAt: this.createdAt,
      currentState: nextState,
      updatedAt: new Date(),
    });
  }
}

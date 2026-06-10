import { v4 as uuidv4 } from 'uuid';
import { BankProductModel } from '../../domain/models/bank-product.model';
import { BankProductType } from '../../domain/models/bank-product-type.enum';
import { BankProductConfiguration } from '../../domain/models/bank-product-configuration.vo';
import { BankProductStatePort } from '../../domain/states/bank-product-state.port';
import { PendingActivationState } from '../../domain/states/pending-activation.state';

/**
 * Builder (GoF): assembles a {@link BankProductModel} step by step. Each
 * setter returns `this` to allow fluent chaining. {@link build} validates
 * that every required field has been supplied before producing the aggregate.
 */
export class BankProductBuilder {
  private _id?: string;
  private _userId?: string;
  private _type?: BankProductType;
  private _configuration?: BankProductConfiguration;
  private _state: BankProductStatePort = new PendingActivationState();
  private _createdAt?: Date;
  private _updatedAt?: Date;

  withId(id: string): this {
    this._id = id;
    return this;
  }

  forUser(userId: string): this {
    this._userId = userId;
    return this;
  }

  ofType(type: BankProductType): this {
    this._type = type;
    return this;
  }

  withConfiguration(configuration: BankProductConfiguration): this {
    this._configuration = configuration;
    return this;
  }

  startingIn(state: BankProductStatePort): this {
    this._state = state;
    return this;
  }

  createdAt(date: Date): this {
    this._createdAt = date;
    return this;
  }

  updatedAt(date: Date): this {
    this._updatedAt = date;
    return this;
  }

  build(): BankProductModel {
    if (!this._userId) {
      throw new Error('BankProductBuilder: userId is required');
    }
    if (!this._type) {
      throw new Error('BankProductBuilder: type is required');
    }
    if (!this._configuration) {
      throw new Error('BankProductBuilder: configuration is required');
    }
    const now = new Date();
    return new BankProductModel({
      id: this._id ?? uuidv4(),
      userId: this._userId,
      type: this._type,
      configuration: this._configuration,
      currentState: this._state,
      createdAt: this._createdAt ?? now,
      updatedAt: this._updatedAt ?? now,
    });
  }
}

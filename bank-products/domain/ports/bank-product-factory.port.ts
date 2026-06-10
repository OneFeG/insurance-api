import { BankProductType } from '../models/bank-product-type.enum';
import { BankProductConfiguration } from '../models/bank-product-configuration.vo';

/**
 * Factory Method (GoF): defines an interface for creating an object's default
 * configuration, but lets subclasses (concrete factories) decide what to
 * produce for each product type.
 */
export abstract class BankProductFactoryPort {
  abstract getProductType(): BankProductType;
  abstract createDefaultConfiguration(): BankProductConfiguration;
}

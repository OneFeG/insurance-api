import { BankProductModel } from '../models/bank-product.model';

export abstract class BankProductRepositoryPort {
  abstract save(product: BankProductModel): Promise<BankProductModel>;
  abstract findById(id: string): Promise<BankProductModel | null>;
  abstract findByUserId(userId: string): Promise<BankProductModel[]>;
}

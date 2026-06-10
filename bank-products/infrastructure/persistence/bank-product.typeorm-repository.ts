import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankProductRepositoryPort } from '../../domain/ports/bank-product-repository.port';
import { BankProductModel } from '../../domain/models/bank-product.model';
import { BankProductTypeormEntity } from './bank-product.typeorm-entity';
import { BankProductMapper } from './bank-product.mapper';

@Injectable()
export class BankProductTypeormRepository implements BankProductRepositoryPort {
  constructor(
    @InjectRepository(BankProductTypeormEntity)
    private readonly repository: Repository<BankProductTypeormEntity>,
    private readonly mapper: BankProductMapper,
  ) {}

  async save(product: BankProductModel): Promise<BankProductModel> {
    const entity = this.mapper.toPersistence(product);
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async findById(id: string): Promise<BankProductModel | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<BankProductModel[]> {
    const entities = await this.repository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
    return entities.map((e) => this.mapper.toDomain(e));
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PolicyRepositoryPort } from '../../domain/ports/policy-repository.port';
import { PolicyModel } from '../../domain/models/policy.model';
import { PolicyTypeormEntity } from './policy.typeorm-entity';
import { PolicyMapper } from './policy.mapper';

@Injectable()
export class PolicyTypeormRepository implements PolicyRepositoryPort {
  constructor(
    @InjectRepository(PolicyTypeormEntity)
    private readonly repository: Repository<PolicyTypeormEntity>,
    private readonly mapper: PolicyMapper,
  ) {}

  async save(policy: PolicyModel): Promise<PolicyModel> {
    const entity = this.mapper.toPersistence(policy);
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async findById(id: string): Promise<PolicyModel | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async findByCustomerId(customerId: string): Promise<PolicyModel[]> {
    const entities = await this.repository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((e) => this.mapper.toDomain(e));
  }

  async findLatestPolicyNumberForYear(year: number): Promise<string | null> {
    const prefix = `POL-${year}-`;
    const entity = await this.repository
      .createQueryBuilder('p')
      .where('p.policyNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('p.policyNumber', 'DESC')
      .limit(1)
      .getOne();
    return entity?.policyNumber ?? null;
  }
}

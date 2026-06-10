import { Injectable } from '@nestjs/common';
import { BankProductRepositoryPort } from '../../domain/ports/bank-product-repository.port';
import { BankProductNotFoundException } from '../../domain/exceptions/bank-product-not-found.exception';
import { BankProductStatus } from '../../domain/models/bank-product-status.enum';
import { BankProductModel } from '../../domain/models/bank-product.model';
import { EventPublisherPort } from '../../../shared/events/ports/event-publisher.port';
import { ChangeBankProductStatusDto } from '../dtos/change-bank-product-status.dto';
import { BankProductResponseDto } from '../dtos/bank-product-response.dto';

const TOPIC_BY_TARGET: Record<BankProductStatus, string | null> = {
  [BankProductStatus.PENDING_ACTIVATION]: null,
  [BankProductStatus.ACTIVE]: 'bank-product.activated',
  [BankProductStatus.SUSPENDED]: 'bank-product.suspended',
  [BankProductStatus.CANCELLED]: 'bank-product.cancelled',
};

@Injectable()
export class ChangeBankProductStatusUseCase {
  constructor(
    private readonly repository: BankProductRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(
    id: string,
    dto: ChangeBankProductStatusDto,
  ): Promise<BankProductResponseDto> {
    const current = await this.repository.findById(id);
    if (!current) {
      throw new BankProductNotFoundException(id);
    }

    const previousStatus = current.status;
    const next = this.applyTransition(current, dto.targetStatus);

    if (next === current) {
      return BankProductResponseDto.fromDomain(current);
    }

    const saved = await this.repository.save(next);

    const topic = TOPIC_BY_TARGET[saved.status];
    if (topic) {
      await this.eventPublisher.publish(topic, {
        productId: saved.id,
        userId: saved.userId,
        type: saved.type,
        previousStatus,
        newStatus: saved.status,
        timestamp: saved.updatedAt.toISOString(),
      });
    }

    return BankProductResponseDto.fromDomain(saved);
  }

  private applyTransition(
    product: BankProductModel,
    target: BankProductStatus,
  ): BankProductModel {
    if (target === BankProductStatus.ACTIVE) {
      return product.status === BankProductStatus.SUSPENDED
        ? product.reactivate()
        : product.activate();
    }
    if (target === BankProductStatus.SUSPENDED) {
      return product.suspend();
    }
    if (target === BankProductStatus.CANCELLED) {
      return product.cancel();
    }
    return product;
  }
}

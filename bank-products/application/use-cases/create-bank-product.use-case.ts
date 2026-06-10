import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { BankProductRepositoryPort } from '../../domain/ports/bank-product-repository.port';
import { BankProductFactoryPort } from '../../domain/ports/bank-product-factory.port';
import { BankProductType } from '../../domain/models/bank-product-type.enum';
import { UnsupportedProductTypeException } from '../../domain/exceptions/unsupported-product-type.exception';
import { UserRepositoryPort } from '../../../users/domain/ports/user-repository.port';
import { UserNotFoundException } from '../../../users/domain/exceptions/user-not-found.exception';
import { EventPublisherPort } from '../../../shared/events/ports/event-publisher.port';
import { BankProductBuilder } from '../builders/bank-product.builder';
import { CreateBankProductDto } from '../dtos/create-bank-product.dto';
import { BankProductResponseDto } from '../dtos/bank-product-response.dto';

export const BANK_PRODUCT_FACTORIES = 'BANK_PRODUCT_FACTORIES';

@Injectable()
export class CreateBankProductUseCase {
  constructor(
    private readonly repository: BankProductRepositoryPort,
    private readonly userRepository: UserRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
    @Inject(BANK_PRODUCT_FACTORIES)
    private readonly factories: Map<BankProductType, BankProductFactoryPort>,
  ) {}

  async execute(dto: CreateBankProductDto): Promise<BankProductResponseDto> {
    const factory = this.factories.get(dto.type);
    if (!factory) {
      throw new UnsupportedProductTypeException(dto.type);
    }

    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new UserNotFoundException(dto.userId);
    }
    if (!user.isActive) {
      throw new BadRequestException(`User ${dto.userId} is inactive`);
    }

    const product = new BankProductBuilder()
      .forUser(dto.userId)
      .ofType(factory.getProductType())
      .withConfiguration(factory.createDefaultConfiguration())
      .build();

    const saved = await this.repository.save(product);

    await this.eventPublisher.publish('bank-product.created', {
      productId: saved.id,
      userId: saved.userId,
      type: saved.type,
      previousStatus: null,
      newStatus: saved.status,
      timestamp: saved.updatedAt.toISOString(),
    });

    return BankProductResponseDto.fromDomain(saved);
  }
}

import { Injectable } from '@nestjs/common';
import { BankProductRepositoryPort } from '../../domain/ports/bank-product-repository.port';
import { BankProductResponseDto } from '../dtos/bank-product-response.dto';

@Injectable()
export class FindUserBankProductsUseCase {
  constructor(private readonly repository: BankProductRepositoryPort) {}

  async execute(userId: string): Promise<BankProductResponseDto[]> {
    const products = await this.repository.findByUserId(userId);
    return products.map((p) => BankProductResponseDto.fromDomain(p));
  }
}

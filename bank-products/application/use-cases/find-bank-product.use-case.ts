import { Injectable } from '@nestjs/common';
import { BankProductRepositoryPort } from '../../domain/ports/bank-product-repository.port';
import { BankProductNotFoundException } from '../../domain/exceptions/bank-product-not-found.exception';
import { BankProductResponseDto } from '../dtos/bank-product-response.dto';

@Injectable()
export class FindBankProductUseCase {
  constructor(private readonly repository: BankProductRepositoryPort) {}

  async execute(id: string): Promise<BankProductResponseDto> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new BankProductNotFoundException(id);
    }
    return BankProductResponseDto.fromDomain(product);
  }
}

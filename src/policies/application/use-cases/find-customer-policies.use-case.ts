import { Injectable } from '@nestjs/common';
import { PolicyRepositoryPort } from '../../domain/ports/policy-repository.port';
import { PolicyResponseDto } from '../dtos/policy-response.dto';

@Injectable()
export class FindCustomerPoliciesUseCase {
  constructor(private readonly policyRepository: PolicyRepositoryPort) {}

  async execute(customerId: string): Promise<PolicyResponseDto[]> {
    const policies = await this.policyRepository.findByCustomerId(customerId);
    return policies.map((p) => PolicyResponseDto.fromDomain(p));
  }
}

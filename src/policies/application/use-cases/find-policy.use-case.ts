import { Injectable } from '@nestjs/common';
import { PolicyRepositoryPort } from '../../domain/ports/policy-repository.port';
import { PolicyNotFoundException } from '../../domain/exceptions/policy-not-found.exception';
import { PolicyResponseDto } from '../dtos/policy-response.dto';

@Injectable()
export class FindPolicyUseCase {
  constructor(private readonly policyRepository: PolicyRepositoryPort) {}

  async execute(id: string): Promise<PolicyResponseDto> {
    const policy = await this.policyRepository.findById(id);
    if (!policy) {
      throw new PolicyNotFoundException(id);
    }
    return PolicyResponseDto.fromDomain(policy);
  }
}

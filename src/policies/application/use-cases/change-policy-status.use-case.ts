import { Injectable } from '@nestjs/common';
import { EventPublisherPort } from '../../../shared/events/ports/event-publisher.port';
import { PolicyNotFoundException } from '../../domain/exceptions/policy-not-found.exception';
import { PolicyStatus } from '../../domain/models/policy-status.enum';
import { PolicyRepositoryPort } from '../../domain/ports/policy-repository.port';
import { ChangePolicyStatusDto } from '../dtos/change-policy-status.dto';
import { PolicyResponseDto } from '../dtos/policy-response.dto';

@Injectable()
export class ChangePolicyStatusUseCase {
  constructor(
    private readonly policyRepository: PolicyRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(
    id: string,
    dto: ChangePolicyStatusDto,
  ): Promise<PolicyResponseDto> {
    const current = await this.policyRepository.findById(id);
    if (!current) {
      throw new PolicyNotFoundException(id);
    }

    const oldStatus = current.status;
    const next = current.transitionTo(dto.targetStatus);

    if (next === current) {
      return PolicyResponseDto.fromDomain(current);
    }

    const saved = await this.policyRepository.save(next);
    const topic = this.getTopic(oldStatus, saved.status);
    await this.eventPublisher.publish(topic, {
      policyId: saved.id,
      policyNumber: saved.policyNumber,
      customerId: saved.customerId,
      branch: saved.branch,
      oldStatus,
      newStatus: saved.status,
      timestamp: saved.updatedAt.toISOString(),
    });

    return PolicyResponseDto.fromDomain(saved);
  }

  private getTopic(oldStatus: PolicyStatus, newStatus: PolicyStatus): string {
    if (newStatus === PolicyStatus.CANCELLED) {
      return 'policy.cancelled';
    }
    if (
      oldStatus === PolicyStatus.QUOTED &&
      newStatus === PolicyStatus.ISSUED
    ) {
      return 'policy.issued';
    }
    if (
      oldStatus === PolicyStatus.ISSUED &&
      newStatus === PolicyStatus.ACTIVE
    ) {
      return 'policy.activated';
    }
    if (
      oldStatus === PolicyStatus.ACTIVE &&
      newStatus === PolicyStatus.SUSPENDED
    ) {
      return 'policy.suspended';
    }
    if (
      oldStatus === PolicyStatus.SUSPENDED &&
      newStatus === PolicyStatus.ACTIVE
    ) {
      return 'policy.reactivated';
    }
    throw new Error(
      `No event topic for transition "${oldStatus}" -> "${newStatus}"`,
    );
  }
}

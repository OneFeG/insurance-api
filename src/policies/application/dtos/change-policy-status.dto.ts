import { IsEnum } from 'class-validator';
import { PolicyStatus } from '../../domain/models/policy-status.enum';

export class ChangePolicyStatusDto {
  @IsEnum(PolicyStatus)
  targetStatus: PolicyStatus;
}

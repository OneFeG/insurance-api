import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BankProductStatus } from '../../domain/models/bank-product-status.enum';

export const ChangeableBankProductStatus = {
  ACTIVE: BankProductStatus.ACTIVE,
  SUSPENDED: BankProductStatus.SUSPENDED,
  CANCELLED: BankProductStatus.CANCELLED,
} as const;
export type ChangeableBankProductStatus =
  (typeof ChangeableBankProductStatus)[keyof typeof ChangeableBankProductStatus];

export class ChangeBankProductStatusDto {
  @ApiProperty({
    enum: [
      BankProductStatus.ACTIVE,
      BankProductStatus.SUSPENDED,
      BankProductStatus.CANCELLED,
    ],
    description:
      'Target status for the product. The server picks the corresponding state ' +
      'transition (activate / suspend / reactivate / cancel) based on the current state.',
    example: BankProductStatus.ACTIVE,
  })
  @IsEnum(ChangeableBankProductStatus)
  targetStatus: ChangeableBankProductStatus;
}

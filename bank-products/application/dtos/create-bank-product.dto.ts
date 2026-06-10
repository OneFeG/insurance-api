import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { BankProductType } from '../../domain/models/bank-product-type.enum';

export class CreateBankProductDto {
  @ApiProperty({
    description: 'UUID of the user that will own the product',
    example: '7e1f6c1a-3b41-4f12-8d8a-3a3f4e9b1c2d',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    enum: BankProductType,
    description: 'Type of bank product to create',
    example: BankProductType.SAVINGS_ACCOUNT,
  })
  @IsEnum(BankProductType)
  type: BankProductType;
}

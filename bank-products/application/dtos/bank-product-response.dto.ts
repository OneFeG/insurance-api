import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BankProductType } from '../../domain/models/bank-product-type.enum';
import { BankProductStatus } from '../../domain/models/bank-product-status.enum';
import { BankProductModel } from '../../domain/models/bank-product.model';

export class BankProductConfigurationResponseDto {
  @ApiPropertyOptional({ example: 2000000 })
  dailyWithdrawalLimit?: number;

  @ApiPropertyOptional({ example: 0.03 })
  annualInterestRate?: number;

  @ApiPropertyOptional({ example: 0.018 })
  monthlyInterestRate?: number;

  @ApiPropertyOptional({ example: 5000000 })
  creditLimit?: number;

  @ApiPropertyOptional({ example: 50000 })
  minimumBalance?: number;
}

export class BankProductResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  userId: string;

  @ApiProperty({ enum: BankProductType })
  type: BankProductType;

  @ApiProperty({ enum: BankProductStatus })
  status: BankProductStatus;

  @ApiProperty({ type: BankProductConfigurationResponseDto })
  configuration: BankProductConfigurationResponseDto;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;

  static fromDomain(model: BankProductModel): BankProductResponseDto {
    const dto = new BankProductResponseDto();
    dto.id = model.id;
    dto.userId = model.userId;
    dto.type = model.type;
    dto.status = model.status;
    dto.configuration = stripUndefined(
      model.configuration.toJSON() as Record<string, unknown>,
    );
    dto.createdAt = model.createdAt;
    dto.updatedAt = model.updatedAt;
    return dto;
  }
}

function stripUndefined(
  obj: Record<string, unknown>,
): BankProductConfigurationResponseDto {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      out[key] = value;
    }
  }
  return out as BankProductConfigurationResponseDto;
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePolicyDto } from '../../application/dtos/create-policy.dto';
import { ChangePolicyStatusDto } from '../../application/dtos/change-policy-status.dto';
import { PolicyResponseDto } from '../../application/dtos/policy-response.dto';
import { CreatePolicyUseCase } from '../../application/use-cases/create-policy.use-case';
import { FindPolicyUseCase } from '../../application/use-cases/find-policy.use-case';
import { FindCustomerPoliciesUseCase } from '../../application/use-cases/find-customer-policies.use-case';
import { ChangePolicyStatusUseCase } from '../../application/use-cases/change-policy-status.use-case';

@Controller('policies')
export class PolicyController {
  constructor(
    private readonly createPolicyUseCase: CreatePolicyUseCase,
    private readonly findPolicyUseCase: FindPolicyUseCase,
    private readonly findCustomerPoliciesUseCase: FindCustomerPoliciesUseCase,
    private readonly changePolicyStatusUseCase: ChangePolicyStatusUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePolicyDto): Promise<PolicyResponseDto> {
    return this.createPolicyUseCase.execute(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PolicyResponseDto> {
    return this.findPolicyUseCase.execute(id);
  }

  @Get('customer/:id')
  findByCustomer(
    @Param('id', ParseUUIDPipe) customerId: string,
  ): Promise<PolicyResponseDto[]> {
    return this.findCustomerPoliciesUseCase.execute(customerId);
  }

  @Patch(':id/status')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangePolicyStatusDto,
  ): Promise<PolicyResponseDto> {
    return this.changePolicyStatusUseCase.execute(id, dto);
  }
}

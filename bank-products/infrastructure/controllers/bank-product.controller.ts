import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CreateBankProductDto } from '../../application/dtos/create-bank-product.dto';
import { ChangeBankProductStatusDto } from '../../application/dtos/change-bank-product-status.dto';
import { BankProductResponseDto } from '../../application/dtos/bank-product-response.dto';
import { CreateBankProductUseCase } from '../../application/use-cases/create-bank-product.use-case';
import { ChangeBankProductStatusUseCase } from '../../application/use-cases/change-bank-product-status.use-case';
import { FindBankProductUseCase } from '../../application/use-cases/find-bank-product.use-case';
import { FindUserBankProductsUseCase } from '../../application/use-cases/find-user-bank-products.use-case';

@ApiTags('bank-products')
@Controller('bank-products')
export class BankProductController {
  constructor(
    private readonly createBankProduct: CreateBankProductUseCase,
    private readonly changeStatus: ChangeBankProductStatusUseCase,
    private readonly findOne: FindBankProductUseCase,
    private readonly findByUser: FindUserBankProductsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a bank product',
    description:
      'Creates a bank product for the given user. The product starts in PENDING_ACTIVATION ' +
      'and uses the default configuration produced by the matching factory.',
  })
  @ApiResponse({ status: 201, type: BankProductResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid type or inactive user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  create(@Body() dto: CreateBankProductDto): Promise<BankProductResponseDto> {
    return this.createBankProduct.execute(dto);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Change the status of a bank product',
    description:
      'Triggers a state transition. The server uses the State pattern to determine whether ' +
      'the requested target status is reachable from the current state. Idempotent if the ' +
      'product is already in the requested status.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: BankProductResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid state transition' })
  @ApiResponse({ status: 404, description: 'Bank product not found' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeBankProductStatusDto,
  ): Promise<BankProductResponseDto> {
    return this.changeStatus.execute(id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a bank product by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: BankProductResponseDto })
  @ApiResponse({ status: 404, description: 'Bank product not found' })
  getOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BankProductResponseDto> {
    return this.findOne.execute(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'List all bank products owned by a user' })
  @ApiParam({ name: 'userId', format: 'uuid' })
  @ApiResponse({ status: 200, type: BankProductResponseDto, isArray: true })
  getForUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<BankProductResponseDto[]> {
    return this.findByUser.execute(userId);
  }
}

import { BadRequestException } from '@nestjs/common';

export class UnsupportedProductTypeException extends BadRequestException {
  constructor(type: string) {
    super(`Unsupported bank product type: ${type}`);
  }
}

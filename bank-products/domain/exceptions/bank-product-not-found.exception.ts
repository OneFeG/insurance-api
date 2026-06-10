import { NotFoundException } from '@nestjs/common';

export class BankProductNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Bank product with id "${id}" not found`);
  }
}

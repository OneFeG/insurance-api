export class InactiveCustomerException extends Error {
  readonly customerId: string;

  constructor(customerId: string) {
    super(`Customer "${customerId}" must exist and be active`);
    this.customerId = customerId;
  }
}

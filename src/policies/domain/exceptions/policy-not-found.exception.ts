export class PolicyNotFoundException extends Error {
  readonly policyId: string;

  constructor(policyId: string) {
    super(`Policy "${policyId}" not found`);
    this.policyId = policyId;
  }
}

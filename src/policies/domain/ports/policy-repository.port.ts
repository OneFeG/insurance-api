import { PolicyModel } from '../models/policy.model';

export abstract class PolicyRepositoryPort {
  abstract save(policy: PolicyModel): Promise<PolicyModel>;
  abstract findById(id: string): Promise<PolicyModel | null>;
  abstract findByCustomerId(customerId: string): Promise<PolicyModel[]>;
  abstract findLatestPolicyNumberForYear(year: number): Promise<string | null>;
}

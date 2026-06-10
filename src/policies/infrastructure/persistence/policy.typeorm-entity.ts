import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { PolicyBranch } from '../../domain/models/policy-branch.enum';
import { PolicyStatus } from '../../domain/models/policy-status.enum';
import { RatingStrategyName } from '../../domain/models/rating-strategy.enum';

@Entity('policies')
export class PolicyTypeormEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 32, unique: true })
  policyNumber: string;

  @Index()
  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'enum', enum: PolicyBranch })
  branch: PolicyBranch;

  @Column({ type: 'enum', enum: RatingStrategyName })
  ratingStrategy: RatingStrategyName;

  @Column({ type: 'enum', enum: PolicyStatus })
  status: PolicyStatus;

  @Column({ type: 'jsonb' })
  coverage: Record<string, unknown>;

  @Column({ type: 'integer' })
  monthlyPremium: number;

  @Column({ type: 'jsonb' })
  riskProfile: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

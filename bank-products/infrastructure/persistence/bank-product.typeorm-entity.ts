import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('bank_products')
export class BankProductTypeormEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index('idx_bank_products_user_id')
  @Column({ type: 'uuid', name: 'user_id' })
  user_id: string;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Index('idx_bank_products_status')
  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ type: 'jsonb' })
  configuration: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}

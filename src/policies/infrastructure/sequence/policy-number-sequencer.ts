import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PolicyNumberSequencerPort } from '../../domain/ports/policy-number-sequencer.port';

@Injectable()
export class PolicyNumberSequencer
  extends PolicyNumberSequencerPort
  implements OnModuleInit
{
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async onModuleInit(): Promise<void> {
    await this.dataSource.query(
      'CREATE SEQUENCE IF NOT EXISTS policy_number_seq START WITH 1 INCREMENT BY 1',
    );
  }

  async next(): Promise<string> {
    const year = new Date().getFullYear();
    const raw = (await this.dataSource.query(
      "SELECT nextval('policy_number_seq') as value",
    )) as unknown;

    if (!Array.isArray(raw) || raw.length === 0) {
      throw new Error('Could not generate policy sequence number');
    }

    const first = raw[0] as { value?: unknown };
    const value = first.value;
    if (typeof value !== 'number' && typeof value !== 'string') {
      throw new Error('Could not parse policy sequence number');
    }

    const numeric = typeof value === 'number' ? value : Number(value);
    const padded = String(numeric).padStart(6, '0');
    return `POL-${year}-${padded}`;
  }
}

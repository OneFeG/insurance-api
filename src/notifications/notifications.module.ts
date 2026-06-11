import { Module } from '@nestjs/common';
import { NotificationsConsumer } from './application/handlers/transfer-events.consumer';
import { AuditEventsConsumer } from './application/handlers/audit-events.consumer';

@Module({
  providers: [NotificationsConsumer, AuditEventsConsumer],
})
export class NotificationsModule {}

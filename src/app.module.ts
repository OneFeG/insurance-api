import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { EventsModule } from './shared/events/events.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PoliciesModule } from './policies/policies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get<string>('DB_PORT', '5433')),
        username: config.get<string>('DB_USERNAME', 'insurance'),
        password: config.get<string>(
          'DB_PASSWORD',
          'insurance_password_change_me',
        ),
        database: config.get<string>('DB_DATABASE', 'insurance_db'),
        autoLoadEntities: true,
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    UsersModule,
    EventsModule,
    NotificationsModule,
    PoliciesModule,
  ],
})
export class AppModule {}

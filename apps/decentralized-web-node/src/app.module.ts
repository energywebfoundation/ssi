import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './modules/logger/logger.module';
import { SentryModule } from './modules/sentry/sentry.module';
import { InterceptorsModule } from './modules/interceptors/interceptors.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { DecentralizedWebNodeModule } from './modules/decentralized-web-node/decentralized-web-node.module';
import { PresentationExchangeModule } from './modules/presentation-exchange/presentation-exchange.module';
import { getDBConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDBConfig
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    LoggerModule,
    SentryModule,
    InterceptorsModule,
    HealthCheckModule,
    DecentralizedWebNodeModule,
    PresentationExchangeModule
  ]
})
export class AppModule {}

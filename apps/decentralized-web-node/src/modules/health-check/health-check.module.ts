import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckController } from './health-check.controller';
import { HealthCheckService } from './health-check.service';

@Module({
  imports: [TerminusModule],
  providers: [HealthCheckService],
  controllers: [HealthCheckController]
})
export class HealthCheckModule {}

import { Injectable } from '@nestjs/common';
import { HealthCheckService as TerminusHealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class HealthCheckService {
  constructor(
    private readonly terminusHealthCheckService: TerminusHealthCheckService,
    private readonly db: TypeOrmHealthIndicator
  ) {}

  async checkLiveness() {
    return this.terminusHealthCheckService.check([() => this.db.pingCheck('postgres')]);
  }

  async checkReadiness() {
    return this.terminusHealthCheckService.check([]);
  }
}

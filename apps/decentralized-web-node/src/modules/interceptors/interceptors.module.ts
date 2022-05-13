import { Module } from '@nestjs/common';
import { SentryModule } from '../sentry/sentry.module';
import { SentryErrorInterceptor } from './sentry-error-interceptor';

@Module({
  imports: [SentryModule],
  providers: [SentryErrorInterceptor],
  exports: [SentryErrorInterceptor]
})
export class InterceptorsModule {}

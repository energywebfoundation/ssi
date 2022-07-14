import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AccessLog } from './middlewares/access-log.middleware';
import { ConverterModule } from './modules/converter/converter.module';

@Module({
  imports: [ConverterModule],
  controllers: [],
  providers: []
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AccessLog).forRoutes('*');
  }
}

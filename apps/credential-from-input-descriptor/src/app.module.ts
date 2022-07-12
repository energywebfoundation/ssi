import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessLog } from './middlewares/access-log.middleware';
import { ConverterModule } from './modules/converter/converter.module';

@Module({
  imports: [ConverterModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AccessLog).forRoutes('*');
  }
}

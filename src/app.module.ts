import Joi from 'joi';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Performance } from './performance/entities/performance.entity';
import { AuthMiddleWare } from './auth/auth.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PerformanceModule } from './performance/performance.module';
import { PointModule } from './point/point.module';
import { Point } from './point/entities/point.entity';
import { PaymentModule } from './payment/payment.module';
import { TicketModule } from './ticket/ticket.module';
import { PlaceModule } from './place/place.module';
import { SeatModule } from './seat/seat.module';
import { Payment } from './payment/entities/payment.entity';
import { Place } from './place/entities/place.entity';
import { Seat } from './seat/entities/seat.entity';
import { Ticket } from './ticket/entities/ticket.entity';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [User, Performance, Point, Payment, Place, Seat, Ticket],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    UserModule,
    PerformanceModule,
    PointModule,
    PaymentModule,
    TicketModule,
    PlaceModule,
    SeatModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthMiddleWare],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleWare)
      .forRoutes(
        { path: 'performance', method: RequestMethod.POST },
        { path: 'user/check', method: RequestMethod.GET },
      );
  }
}

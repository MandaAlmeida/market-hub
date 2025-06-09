import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { User } from './entity/user.entity';
import { Ads } from './entity/ads.entity';
import { ItensOrder } from './entity/ItensOrder.entity';
import { Orders } from './entity/orders.entity';
import { Pay } from './entity/pay.entity';
import { Reviews } from './entity/reviews.entity';
import { UserModule } from './module/user.module';
import { AdsModule } from './module/ads.module';
import { OrdersModule } from './module/orders.module';
import { Category } from './entity/category.entity';
import { ItensOrderModule } from './module/itensOrder.module';
import { PayModule } from './module/pay.module';
import { CategoryModule } from './module/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Ads, ItensOrder, Orders, Pay, Reviews, Category],
      synchronize: false,
      logging: true,
      ssl: { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' }
    }),

    TypeOrmModule.forFeature([User, Ads, ItensOrder, Orders, Pay, Reviews, Category]),

    UserModule,
    AdsModule,
    OrdersModule,
    ItensOrderModule,
    PayModule,
    CategoryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

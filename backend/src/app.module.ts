import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { User } from './entity/user.entity';
import { Ads } from './entity/ads.entity';
import { ItensOrder } from './entity/ItensOrder.entity';
import { Orders } from './entity/orders.entity';
import { Pay } from './entity/pay.entity';
import { UserModule } from './module/user.module';
import { AdsModule } from './module/ads.module';
import { OrdersModule } from './module/orders.module';
import { Category } from './entity/category.entity';
import { ItensOrderModule } from './module/itensOrder.module';
import { PayModule } from './module/pay.module';
import { CategoryModule } from './module/category.module';
import { SubCategory } from './entity/subcategory.entity';
import { SubCategoryModule } from './module/subCategory.module';
import { UploadModule } from './module/upload.module';
import { Image } from './entity/image.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Ads, ItensOrder, Orders, Pay, Category, SubCategory, Image],
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
      logging: ['error'],
    }),



    TypeOrmModule.forFeature([User, Ads, ItensOrder, Orders, Pay, Category, SubCategory, Image]),

    UserModule,
    AdsModule,
    OrdersModule,
    ItensOrderModule,
    PayModule,
    CategoryModule,
    SubCategoryModule,
    UploadModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

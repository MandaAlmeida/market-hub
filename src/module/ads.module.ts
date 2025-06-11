import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ads } from 'src/entity/ads.entity';
import { AdsService } from 'src/service/ads.service';
import { AdsController } from 'src/controller/ads.controller';
import { UserModule } from './user.module';
import { CategoryModule } from './category.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([Ads]),
        AuthModule,
        UserModule,
        CategoryModule
    ],
    controllers: [AdsController],
    providers: [AdsService],
    exports: [AdsService]

})
export class AdsModule { }

import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ads } from 'src/entity/ads.entity';
import { AdsService } from 'src/service/ads.service';
import { AdsController } from 'src/controller/ads.controller';
import { UserModule } from './user.module';
import { UploadModule } from './upload.module';
import { SubCategoryModule } from './subCategory.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([Ads]),
        AuthModule,
        UserModule,
        SubCategoryModule,
        UploadModule
    ],
    controllers: [AdsController],
    providers: [AdsService],
    exports: [AdsService]

})
export class AdsModule { }

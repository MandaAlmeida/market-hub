import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ads } from 'src/entity/ads.entity';
import { AdsService } from 'src/service/ads.service';
import { AdsController } from 'src/controller/ads.controller';


@Module({
    imports: [AuthModule,
        TypeOrmModule.forFeature([Ads])
    ],
    controllers: [AdsController],
    providers: [AdsService],
    exports: [AdsService]

})
export class AdsModule { }

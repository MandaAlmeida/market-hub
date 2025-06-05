import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from 'src/entity/orders.entity';
import { OrdersService } from 'src/service/orders.service';
import { OrdersController } from 'src/controller/orders.controller';


@Module({
    imports: [AuthModule,
        TypeOrmModule.forFeature([Orders])
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule { }

import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from 'src/entity/orders.entity';
import { OrdersService } from 'src/service/orders.service';
import { OrdersController } from 'src/controller/orders.controller';
import { ItensOrderController } from 'src/controller/itensOrders.controller';
import { ItensOrderService } from 'src/service/itensOrder.service';
import { AdsModule } from './ads.module';
import { ItensOrder } from 'src/entity/ItensOrder.entity';
import { OrdersModule } from './orders.module';


@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([ItensOrder]),
        AdsModule,
        OrdersModule
    ],
    controllers: [ItensOrderController],
    providers: [ItensOrderService],
    exports: [ItensOrderService]
})
export class ItensOrderModule { }

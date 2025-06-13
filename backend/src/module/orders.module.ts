import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from 'src/entity/orders.entity';
import { OrdersService } from 'src/service/orders.service';
import { OrdersController } from 'src/controller/orders.controller';
import { ItensOrder } from 'src/entity/ItensOrder.entity';


@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Orders, ItensOrder])
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService]

})
export class OrdersModule { }

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { PayController } from "src/controller/pay.controller";
import { Pay } from "src/entity/pay.entity";
import { PayService } from "src/service/pay.service";
import { OrdersModule } from "./orders.module";

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Pay]),
        OrdersModule
    ],
    controllers: [PayController],
    providers: [PayService]
})

export class PayModule { }
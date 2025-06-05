import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { OrderStatusType } from "src/entity/enum/orderStatus.enum";

export class CreateOrdersDTO {
    @IsNotEmpty()
    @IsString()
    priceTotal: string;
}

export class UpdateOrdersDTO {
    @IsOptional()
    @IsString()
    status: OrderStatusType

    @IsOptional()
    @IsString()
    priceTotal: string;
}
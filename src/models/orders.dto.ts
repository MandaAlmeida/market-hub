import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { OrderStatusType } from "src/entity/enum/orderStatus.enum";

class NewItemDTO {
    @IsString()
    adsId: string;

    @IsInt()
    @Min(1)
    quantify: number;

    @IsInt()
    @Min(1)
    unitPrice: number;
}

export class CreateOrdersDTO {
    @IsNotEmpty()
    @IsArray()
    itensOrder: NewItemDTO[]
}

export class UpdateOrdersDTO {
    @IsOptional()
    @IsString()
    status: OrderStatusType

    @IsOptional()
    @IsString()
    priceTotal: string;

    @IsOptional()
    @IsArray()
    itensOrder: NewItemDTO[]
}
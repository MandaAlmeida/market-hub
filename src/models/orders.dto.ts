import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { OrderStatusType } from "src/entity/enum/orderStatus.enum";

class NewItemDTO {
    @IsString()
    @ApiProperty({
        description: "ID do anúncio referente ao item do pedido",
        example: "abc123-xyz789"
    })
    adsId: string;

    @IsInt()
    @Min(1)
    @ApiProperty({
        description: "Quantidade do item no pedido",
        example: 2,
        minimum: 1
    })
    quantify: number;

    @IsInt()
    @Min(1)
    @ApiProperty({
        description: "Preço unitário do item",
        example: 100,
        minimum: 1
    })
    unitPrice: number;
}

export class CreateOrdersDTO {
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({
        description: "Lista de itens no pedido",
        type: [NewItemDTO]
    })
    itensOrder: NewItemDTO[];
}

export class UpdateOrdersDTO {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "Status atual do pedido",
        enum: OrderStatusType,
        example: OrderStatusType.PENDING
    })
    status: OrderStatusType;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "Preço total do pedido",
        example: 300
    })
    priceTotal: number;

    @IsOptional()
    @IsArray()
    @ApiPropertyOptional({
        description: "Lista de itens atualizada no pedido",
        type: [NewItemDTO]
    })
    itensOrder: NewItemDTO[];
}

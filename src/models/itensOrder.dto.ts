import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateItensOrderDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "ID do anúncio relacionado ao item do pedido",
        example: "10263af5-4b89-4d4a-a4a9-f10b8686fede"
    })
    adsId: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        description: "Quantidade do item no pedido",
        example: 2
    })
    quantify: number;
}

export class UpdateItensOrderDTO {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "ID do anúncio relacionado ao item do pedido",
        example: "10263af5-4b89-4d4a-a4a9-f10b8686fede"
    })
    adsId: string;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({
        description: "Quantidade atualizada do item no pedido",
        example: 3
    })
    quantify: number;

}

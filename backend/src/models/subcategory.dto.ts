import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateSubCategoryDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "Adiciona nome da subcategoria",
        example: "Celulares e Smartphones"
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "Adiciona id da categoria",
        example: "189af4ab-7a41-42cb-a377-879b9f16290a"
    })
    category: string;

}

export class UpdateSubCategoryDTO {
    @IsString()
    @ApiProperty({
        description: "Adiciona nome da categoria",
        example: "Celulares e Smartphones"
    })
    name: string;

    @IsBoolean()
    @ApiProperty({
        description: "Ativa a categoria",
        example: "true"
    })
    active: boolean;

    @IsString()
    @ApiProperty({
        description: "Adiciona id da categoria",
        example: "Celulares e Smartphones"
    })
    category: string;
}
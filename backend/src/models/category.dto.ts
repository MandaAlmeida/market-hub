import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "Adiciona nome da categoria",
        example: "Eletrônicos"
    })
    name: string;
}

export class UpdateCategoryDTO {
    @IsString()
    @ApiProperty({
        description: "Adiciona nome da categoria",
        example: "Eletrônicos"
    })
    name: string;

    @IsBoolean()
    @ApiProperty({
        description: "Ativa a categoria",
        example: "true"
    })
    active: boolean;
}
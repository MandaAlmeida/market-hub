import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateAdsDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "Título do anúncio",
        example: "Smartphone Samsung Galaxy S21"
    })
    title: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "Descrição do anúncio",
        example: "Novo, com garantia de fábrica de 12 meses"
    })
    description: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "Preço do produto",
        example: 1999.90
    })
    price: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "ID da subcategoria do produto",
        example: "770264c3-b7b4-40ac-8f74-478f2ae95d0a"
    })
    subCategory: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        description: "Quantidade em estoque",
        example: 50
    })
    stock: number;
}

export class UpdateAdsDTO {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "Título atualizado do anúncio",
        example: "Smartphone Galaxy S21 Ultra"
    })
    title: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "Descrição atualizada do anúncio",
        example: "Produto novo com brindes exclusivos"
    })
    description: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "Preço do produto",
        example: 1999.90
    })
    price: number;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: "Subcategoria atualizada",
        example: "eletronicos"
    })
    subCategory: string;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({
        description: "Estoque atualizado",
        example: 30
    })
    stock: number;

    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional({
        description: "Status do anúncio (ativo ou inativo)",
        example: true
    })
    active: boolean;
}

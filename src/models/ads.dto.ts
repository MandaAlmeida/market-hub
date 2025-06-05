import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAdsDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    price: string;

    @IsNotEmpty()
    @IsString()
    categorie: string;

    @IsNotEmpty()
    @IsString()
    stock: string;
}

export class UpdateAdsDTO {
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    price: string;

    @IsOptional()
    @IsString()
    categorie: string;

    @IsOptional()
    @IsString()
    stock: string;

    @IsOptional()
    @IsBoolean()
    active: boolean
}
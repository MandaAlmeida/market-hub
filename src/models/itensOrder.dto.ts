import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateItensOrderDTO {
    @IsNotEmpty()
    @IsString()
    adsId: string;

    @IsNotEmpty()
    @IsNumber()
    quantify: number;

    @IsNotEmpty()
    @IsNumber()
    unitPrice: number;
}

export class UpdateItensOrderDTO {
    @IsOptional()
    @IsString()
    adsId: string;

    @IsOptional()
    @IsNumber()
    quantify: number;

    @IsOptional()
    @IsNumber()
    unitPrice: number;
}
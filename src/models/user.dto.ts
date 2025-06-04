// import { ApiProperty } from "@nestjs/swagger";
import {
    IsArray,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty({ message: "O nome é obrigatório." })
    @IsString()
    name: string;

    @IsNotEmpty({ message: "O e-mail é obrigatório." })
    @IsEmail({}, { message: "E-mail inválido." })
    email: string;

    @IsString()
    address: string;

    @IsString()
    type: string;

    @IsString()
    password: string;

    @IsString()
    passwordConfirmation: string;
}

export class LoginUserDTO {
    @IsNotEmpty({ message: "O e-mail é obrigatório." })
    @IsEmail({}, { message: "E-mail inválido." })
    email: string;

    @IsNotEmpty({ message: "A senha é obrigatória." })
    @IsString()
    password: string;
}

export class UpdateUserDTO {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsEmail({}, { message: "E-mail inválido." })
    email: string;

    @IsOptional()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    type: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    passwordConfirmation: string;
}
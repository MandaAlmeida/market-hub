// import { ApiProperty } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty({ message: "O nome é obrigatório." })
    @IsString()
    @ApiProperty({
        description: "Nome de usuario",
        example: "Diego20"
    })
    name: string;

    @IsNotEmpty({ message: "O e-mail é obrigatório." })
    @IsEmail({}, { message: "E-mail inválido." })
    @ApiProperty({
        description: "Email do usuario",
        example: "teste@gmail.com"
    })
    email: string;

    @IsString()
    @ApiProperty({ description: "Endereço do usuário", example: "Rua X, 123" })
    address: string;

    @IsString()
    @ApiProperty({
        description: "Tipo de usuario",
        example: "SELLER"
    })
    type: string;

    @IsString()
    @ApiProperty({
        description: "Senha para acessar a aplicacao",
        example: "12345678"
    })
    password: string;

    @IsString()
    @ApiProperty({
        description: "Senha para acessar a aplicacao",
        example: "12345678"
    })
    passwordConfirmation: string;
}

export class LoginUserDTO {
    @IsNotEmpty({ message: "O e-mail é obrigatório." })
    @IsEmail({}, { message: "E-mail inválido." })
    @ApiProperty({
        description: "Email do usuario",
        example: "teste@gmail.com"
    })
    email: string;

    @IsNotEmpty({ message: "A senha é obrigatória." })
    @IsString()
    @ApiProperty({
        description: "Senha para acessar a aplicacao",
        example: "12345678"
    })
    password: string;
}

export class UpdateUserDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({ description: "Nome do usuário", example: "Diego20" })
    name: string;

    @IsOptional()
    @IsEmail({}, { message: "E-mail inválido." })
    @ApiProperty({ description: "E-mail do usuário", example: "teste@gmail.com" })
    email: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: "Endereço do usuário", example: "Rua X, 123" })
    address: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: "Tipo de usuário", example: "SELLER" })
    type: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: "Nova senha", example: "novasenha123" })
    password: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: "Confirmação da nova senha", example: "novasenha123" })
    passwordConfirmation: string;
}

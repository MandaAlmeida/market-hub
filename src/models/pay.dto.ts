import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PayType } from "src/entity/enum/pay.enum";

export class CreatePayDTO {
    @IsNotEmpty()
    @IsEnum(PayType, { message: 'Método de pagamento inválido. Use CARD, TICKET ou PIX.' })
    payMethod: PayType;
}
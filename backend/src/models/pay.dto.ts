import { IsEnum, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PayType } from "src/entity/enum/pay.enum";

export class CreatePayDTO {
    @IsNotEmpty()
    @IsEnum(PayType, { message: 'Método de pagamento inválido. Use CARD, TICKET ou PIX.' })
    @ApiProperty({
        description: "Método de pagamento",
        enum: PayType,
        example: PayType.PIX
    })
    payMethod: PayType;
}

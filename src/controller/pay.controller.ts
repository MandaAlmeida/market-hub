import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreatePayDTO } from "src/models/pay.dto";
import { PayService } from "src/service/pay.service";

@Controller("pay")
@UseGuards(JwtAuthGuard)
export class PayController {
    constructor(private payService: PayService) { }

    @Post(":orderId")
    async createPay(@CurrentUser() user: { sub: string }, @Body() pay: CreatePayDTO, @Param("orderId") orderId: string) {
        return this.payService.createPay(user, pay, orderId);
    }

    @Post("/:id/verify")
    async verifyPay(@Param("id") id: string) {
        return this.payService.verifyPaymentWithTransaction(id);
    }

    @Post("/:id/cancel")
    async cancelPay(@Param("id") id: string) {
        return this.payService.cancelPaymentWithTransaction(id);
    }

    @Get()
    async fetchPayment(@CurrentUser() user: { sub: string }) {
        return this.payService.fetchPayment(user)
    }
}
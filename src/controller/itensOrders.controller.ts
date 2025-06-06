import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreateItensOrderDTO } from "src/models/itensOrder.dto";
import { ItensOrderService } from "src/service/itensOrder.service";



@Controller("itensOrder")
@UseGuards(JwtAuthGuard)
export class ItensOrderController {
    constructor(private readonly itensOrderService: ItensOrderService) { }

    @Post()
    async createItensOrder(@CurrentUser() user: { sub: string }, @Body() itensOrder: CreateItensOrderDTO[]) {
        return this.itensOrderService.createItensOrder(user, itensOrder);
    }

    @Get(":id")
    async findOneItensOrder(@Param("id") id: string) {
        return this.itensOrderService.findOne(id);
    }

    @Put(":id")
    async updateStatus(@Param("id") id: string, @CurrentUser() user: { sub: string }, @Body("status") status: string) {
        return this.itensOrderService.updateStatus(id, user, status)
    }

    @Delete("/removeItem/:orderId")
    async removeItensOrder(@Param("orderId") orderId: string, @CurrentUser() user: { sub: string }, @Body() itensOrder: CreateItensOrderDTO) {
        return this.itensOrderService.removeItensOrder(orderId, user, itensOrder)
    }
}
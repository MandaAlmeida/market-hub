import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreateOrdersDTO, UpdateOrdersDTO } from "src/models/orders.dto";
import { OrdersService } from "src/service/orders.service";

@Controller("orders")
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    async createOrders(@CurrentUser() user: { sub: string }, @Body() orders: CreateOrdersDTO) {
        return this.ordersService.createOrders(user, orders);
    }

    @Get(":id")
    async findOneOrders(@Param("id") id: string) {
        return this.ordersService.findOne(id);
    }

    @Get()
    async findAllOrders(@Query("p") page?: number, @Query("l") limit?: number) {
        return this.ordersService.findAll(page, limit);
    }

    // @Put(":id")
    // async updateOrders(@Param("id") id: string, @CurrentUser() user: { sub: string }, @Body() orders: UpdateOrdersDTO) {
    //     return this.ordersService.updateOrders(id, user, orders)
    // }

    // @Delete(":id")
    // async removeOrders(@Param("id") id: string) {
    //     return this.ordersService.removeOrders(id)
    // }

}
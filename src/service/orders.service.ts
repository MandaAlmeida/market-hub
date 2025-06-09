import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderStatusType } from "src/entity/enum/orderStatus.enum";
import { Orders } from "src/entity/orders.entity";
import { Repository } from "typeorm";

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Orders)
        private ordersRepository: Repository<Orders>,
    ) { }

    async createOrders(user: { sub: string }) {
        const order = await this.ordersRepository.findOne({
            where: {
                user: { id: user.sub },
                status: OrderStatusType.PENDING,
            },
            relations: ['user', 'itensOrder'],
        });

        if (order) return order;

        const newOrders = {
            user: { id: user.sub },
            status: OrderStatusType.PENDING,
            priceTotal: 0,
        };

        return this.ordersRepository.save(newOrders);
    }


    async findOne(id: string) {
        const orders = this.checkExistOrders(id)

        return orders;
    }

    async findAll(page: number = 1, limit: number = 10) {
        const [data, total] = await this.ordersRepository.findAndCount({
            relations: ['user', 'itensOrder', 'pay', 'reviews'],
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async updateOrders(id: string, user: { sub: string }, priceTotalChange: number) {
        const existOrders = await this.checkExistOrders(id);

        if (existOrders.user.id !== user.sub) throw new ForbiddenException('Você não tem permissão para atualizar este pedido');

        const currentTotalCents = Math.round((existOrders.priceTotal || 0) * 100);
        const changeCents = Math.round(priceTotalChange * 100);

        let newTotalCents = currentTotalCents + changeCents;
        if (newTotalCents < 0) newTotalCents = 0; // evitar total negativo

        existOrders.priceTotal = newTotalCents / 100;

        const updatedOrder = await this.ordersRepository.save(existOrders);

        return updatedOrder;
    }

    async checkAndUpdateOrderStatus(orderId: string) {
        const order = await this.ordersRepository.findOne({
            where: { id: orderId },
            relations: ['itensOrder'],
        });

        if (!order) throw new NotFoundException('Pedido não encontrado');

        const allPaid = order.itensOrder.length > 0 && order.itensOrder.every(item => item.status === OrderStatusType.PAID);
        const allSent = order.itensOrder.length > 0 && order.itensOrder.every(item => item.status === OrderStatusType.SENT);

        if (allSent) {
            order.status = OrderStatusType.SENT;
        } else if (allPaid) {
            order.status = OrderStatusType.PAID;
        } else {
            return order;
        }

        return this.ordersRepository.save(order);
    }


    async removeOrders(id: string) {
        const existOrders = await this.ordersRepository.findOne({
            where: { id },
            relations: ['itensOrder', 'pay'],
        });

        if (!existOrders) throw new NotFoundException("Pedido não encontrado");


        if (existOrders.status === 'PENDING') {
            await this.ordersRepository.remove(existOrders);
            return { message: 'Pedido removido com sucesso' };
        }

        return {
            message: `Não é possível excluir pedido com status igual a '${existOrders.status}'`,
        };
    }


    private async checkExistOrders(id: string) {
        const orders = await this.ordersRepository.findOne({
            where: { id },
            relations: ['user', 'pay', 'reviews']
        })

        if (!orders) throw new NotFoundException("Pedido não encontrado")

        return orders
    }

}
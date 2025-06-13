import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderStatusType } from "src/entity/enum/orderStatus.enum";
import { PayStatusType } from "src/entity/enum/payStatus.enum";
import { ItensOrder } from "src/entity/ItensOrder.entity";
import { Orders } from "src/entity/orders.entity";
import { Repository } from "typeorm";

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Orders)
        private ordersRepository: Repository<Orders>,
        @InjectRepository(ItensOrder)
        private itensOrderRepository: Repository<ItensOrder>
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

    async findAll(user: { sub: string }, page: number = 1, limit: number = 10) {
        const warnings: string[] = [];
        const [orders, total] = await this.ordersRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.user', 'user')
            .leftJoinAndSelect('order.itensOrder', 'itemOrder')
            .leftJoinAndSelect('itemOrder.ads', 'ads')
            .leftJoinAndSelect('ads.image', 'image')
            .leftJoinAndSelect('order.pay', 'pay')
            .where('user.id = :userId', { userId: user.sub })
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        for (const order of orders) {
            // Se a ordem tiver pagamento confirmado, pule a atualização
            const hasConfirmedPayment = order.pay?.some(p => p.status === PayStatusType.CONFIRMED);
            if (hasConfirmedPayment) continue;

            let newTotal = 0;

            for (const item of order.itensOrder) {
                if (item.ads.stock <= 0 && item.status === OrderStatusType.PENDING) {
                    item.status = OrderStatusType.ZERO_STOCK;
                    await this.itensOrderRepository.save(item);
                    warnings.push(`Item ${item.ads.title} foi removido do carrinho por falta de estoque.`);
                }

                if (item.ads.stock > 0 && item.status === OrderStatusType.ZERO_STOCK) {
                    item.status = OrderStatusType.PENDING;
                    await this.itensOrderRepository.save(item);
                } else if (item.quantify > item.ads.stock) {
                    item.quantify = item.ads.stock;
                    item.status = OrderStatusType.PENDING;
                    await this.itensOrderRepository.save(item);
                    warnings.push(`A quantidade do item ${item.ads.title} foi reduzida para ${item.ads.stock} por falta de estoque.`);
                }

                if (item.status === OrderStatusType.PENDING) {
                    newTotal += item.unitPrice * item.quantify;
                }
            }

            const oldTotal = order.priceTotal || 0;
            const diff = newTotal - oldTotal;

            if (diff !== 0) {
                await this.updateOrders(order.id, user, diff);
            }
        }

        return {
            data: orders,
            warnings,
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
            relations: ['user', 'pay', 'itensOrder', 'itensOrder.ads']
        })

        if (!orders) throw new NotFoundException("Pedido não encontrado")

        return orders
    }

}
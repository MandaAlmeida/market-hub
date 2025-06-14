import { InjectRepository } from "@nestjs/typeorm";
import { ItensOrder } from "src/entity/ItensOrder.entity";
import { CreateItensOrderDTO } from "src/models/itensOrder.dto";
import { Repository } from "typeorm";
import { AdsService } from "./ads.service";
import { OrdersService } from "./orders.service";
import { BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";
import { OrderStatusType } from "src/entity/enum/orderStatus.enum";

export class ItensOrderService {
    constructor(

        private adsService: AdsService,
        private orderService: OrdersService,
        @InjectRepository(ItensOrder)
        private itensOrderRepository: Repository<ItensOrder>
    ) { }

    async createItensOrder(user: { sub: string }, itensOrder: CreateItensOrderDTO[]) {
        const itens: ItensOrder[] = [];
        let priceTotal = 0;

        const order = await this.orderService.createOrders(user);

        for (const item of itensOrder) {
            const ads = await this.adsService.checkExistAds(item.adsId);

            const existingItem = await this.itensOrderRepository.findOne({
                where: {
                    order: { id: order.id },
                    ads: { id: ads.id },
                },
                relations: ['ads', 'order'],
            });

            const currentQuantify = existingItem ? existingItem.quantify : 0;
            const requestedTotal = currentQuantify + item.quantify;

            if (ads.stock < requestedTotal) throw new BadRequestException(`Estoque insuficiente para o produto "${ads.title}". Disponível: ${ads.stock}, Solicitado: ${requestedTotal}`);


            const itemTotal = ads.price * item.quantify;
            priceTotal += itemTotal;

            if (existingItem) {
                existingItem.quantify += item.quantify;
                existingItem.unitPrice = ads.price;

                const updatedItem = await this.itensOrderRepository.save(existingItem);
                itens.push(updatedItem);
            } else {
                const newItem = this.itensOrderRepository.create({
                    order,
                    ads,
                    status: OrderStatusType.PENDING,
                    quantify: item.quantify,
                    unitPrice: ads.price,
                });

                const savedItem = await this.itensOrderRepository.save(newItem);
                itens.push(savedItem);
            }
        }

        const updatedOrder = await this.orderService.updateOrders(order.id, user, priceTotal);

        return {
            order: updatedOrder,
            itens,
        };
    }


    async findOne(id: string) {
        return await this.checkExistItem(id)
    }

    async updateStatus(id: string, user: { sub: string }, status: string) {
        const itemOrder = await this.checkExistItem(id);

        switch (status) {
            case OrderStatusType.PAID:
                itemOrder.status = OrderStatusType.PAID;
                break;

            case OrderStatusType.SENT:
                const ads = await this.adsService.checkExistAds(itemOrder.ads.id);

                if (ads.user.id !== user.sub) throw new ForbiddenException('Você não tem permissão para alterar o status para SENT.');

                itemOrder.status = OrderStatusType.SENT;
                break;

            default:
                throw new BadRequestException('Status informado não é válido.');
        }
        const newStatusItemOrder = await this.itensOrderRepository.save(itemOrder);
        await this.orderService.checkAndUpdateOrderStatus(itemOrder.order.id);

        return newStatusItemOrder;
    }

    async removeItensOrder(orderId: string, user: { sub: string }, itensOrders: CreateItensOrderDTO) {
        const itensOrder = await this.itensOrderRepository.find({
            where: { order: { id: orderId } },
            relations: ['ads']
        });

        const exists = itensOrder.find(item => item.ads.id === itensOrders.adsId);

        if (!exists) throw new NotFoundException('Item não encontrado na ordem.');

        const currentQuantity = exists.quantify;
        const quantityToRemove = itensOrders.quantify;

        if (quantityToRemove > currentQuantity) throw new BadRequestException('Quantidade a remover é maior que a quantidade disponível.');

        const valueToRemove = exists.unitPrice * quantityToRemove;

        if (quantityToRemove === currentQuantity) {
            await this.itensOrderRepository.remove(exists);
        } else {
            exists.quantify = (currentQuantity - quantityToRemove);
            await this.itensOrderRepository.save(exists);
        }

        await this.orderService.updateOrders(orderId, user, -valueToRemove);

        // VERIFICA SE AINDA EXISTEM ITENS NA ORDEM
        const remainingItems = await this.itensOrderRepository.count({
            where: { order: { id: orderId } }
        });

        if (remainingItems === 0) {
            await this.orderService.removeOrders(orderId);
        }

        return { message: 'Itens removidos com sucesso' };
    }

    private async checkExistItem(id: string) {
        const itensOrder = await this.itensOrderRepository.findOne({
            where: { id },
            relations: ['ads', "order"]
        });
        if (!itensOrder) throw new NotFoundException("Item não encontrado")

        return itensOrder;
    }
} 
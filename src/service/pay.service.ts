import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Pay } from "src/entity/pay.entity";
import { CreatePayDTO } from "src/models/pay.dto";
import { EntityManager, In, Repository } from "typeorm";
import { OrdersService } from "./orders.service";
import { PayStatusType } from "src/entity/enum/payStatus.enum";
import { DataSource } from 'typeorm';
import { OrderStatusType } from "src/entity/enum/orderStatus.enum";

@Injectable()
export class PayService {
    constructor(
        @InjectRepository(Pay)
        private payRepository: Repository<Pay>,
        private orderService: OrdersService,
        @InjectDataSource()
        private dataSource: DataSource,
    ) { }

    async createPay(user: { sub: string }, pay: CreatePayDTO, orderId: string) {
        const order = await this.orderService.findOne(orderId);

        if (order.user.id !== user.sub) throw new ForbiddenException("Você não tem permissão para alterar esse pedido");

        const existingPay = await this.payRepository.findOne({
            where: {
                order: { id: order.id },
                status: In([PayStatusType.PENDING, PayStatusType.CONFIRMED])
            }
        });

        if (existingPay) throw new BadRequestException("Já existe um pagamento ativo para este pedido.");

        const newPay = {
            order: order,
            price: order.priceTotal,
            payMethod: pay.payMethod,
            status: PayStatusType.PENDING
        }

        return this.payRepository.save(newPay)
    }

    async verifyPaymentWithTransaction(payId: string) {
        return await this.dataSource.transaction(async (manager) => {
            const payment = await this.checkExistPay(manager, payId)
            const isSuccess = Math.random() < 0.7;

            if (isSuccess) {
                payment.status = PayStatusType.CONFIRMED;
                await manager.save(payment);

                payment.order.status = OrderStatusType.PAID;
                await manager.save(payment.order);

                for (const item of payment.order.itensOrder) {
                    item.status = OrderStatusType.PAID;
                    await manager.save(item);
                }
            } else {
                payment.status = PayStatusType.FAILED;
                await manager.save(payment);
            }

            return {
                message: isSuccess ? "Pagamento confirmado!" : "Pagamento falhou.",
                status: payment.status
            }
        })
    }

    async cancelPaymentWithTransaction(payId: string) {
        return await this.dataSource.transaction(async (manager) => {
            const payment = await this.checkExistPay(manager, payId);

            if (payment.status === PayStatusType.CANCELLED) throw new BadRequestException("Pagamento já foi cancelado.");

            if (payment.status === PayStatusType.CONFIRMED && payment.order.status !== OrderStatusType.SENT) {
                payment.status = PayStatusType.CANCELLED;
                await manager.save(payment);

                payment.order.status = OrderStatusType.CANCELLED;
                await manager.save(payment.order);

                for (const item of payment.order.itensOrder) {
                    item.status = OrderStatusType.CANCELLED;
                    await manager.save(item);
                }

                return {
                    message: payment.status === PayStatusType.CANCELLED ? "Pagamento cancelado!" : "Falha ao tentar cancelar pagamento.",
                    status: payment.status
                }
            }

            throw new BadRequestException("Não é possível cancelar o pagamento nesse pedido.");

        })
    }

    async fetchPayment(user: { sub: string }) {
        const payments = await this.payRepository.find({
            where: {
                order: {
                    user: {
                        id: user.sub
                    }
                }
            },
            relations: ['order', 'order.user', 'order.itensOrder'],
            order: {
                createdAt: 'DESC'
            }
        });

        return payments;
    }

    async checkExistPay(manager: EntityManager, payId: string) {
        const payment = await manager.findOne(Pay, {
            where: { id: payId },
            relations: ['order', 'order.itensOrder', 'order.user']
        });

        if (!payment) throw new NotFoundException("Pagamento não encontrado");

        return payment;
    }
}
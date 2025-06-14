import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Pay } from "src/entity/pay.entity";
import { CreatePayDTO } from "src/models/pay.dto";
import { In, Repository } from "typeorm";
import { OrdersService } from "./orders.service";
import { PayStatusType } from "src/entity/enum/payStatus.enum";
import { DataSource } from 'typeorm';
import { OrderStatusType } from "src/entity/enum/orderStatus.enum";
import { Ads } from "src/entity/ads.entity";
import { ItensOrder } from "src/entity/ItensOrder.entity";

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

        if (order.user.id !== user.sub) {
            throw new ForbiddenException("Você não tem permissão para alterar esse pedido");
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        // Atualiza status dos itens com estoque insuficiente
        for (const item of order.itensOrder) {
            const ads = await queryRunner.manager.findOne(Ads, {
                where: { id: item.ads.id },
                relations: ['user', 'subCategory', 'image']
            });

            if (!ads) throw new NotFoundException("Anúncio não encontrado");

            if (ads.stock < item.quantify && item.status === OrderStatusType.PENDING) {
                await queryRunner.manager.update(ItensOrder, { id: item.id }, {
                    status: OrderStatusType.ZERO_STOCK
                });
                item.status = OrderStatusType.ZERO_STOCK;
            }
        }

        // Verifica se há itens sem estoque suficiente
        const hasZeroStockItem = order.itensOrder.some(item => item.status === OrderStatusType.ZERO_STOCK);
        if (hasZeroStockItem) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new BadRequestException("Não é possível criar pagamento: existem itens sem estoque suficiente no pedido.");
        }

        // Verifica pagamento ativo
        const existingPay = await this.payRepository.findOne({
            where: {
                order: { id: order.id },
                status: In([PayStatusType.PENDING, PayStatusType.CONFIRMED])
            }
        });

        if (existingPay) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new BadRequestException("Já existe um pagamento ativo para este pedido.");
        }

        const newPay = {
            order: order,
            price: order.priceTotal,
            payMethod: pay.payMethod,
            status: PayStatusType.PENDING
        };

        const savedPay = await this.payRepository.save(newPay);

        await queryRunner.commitTransaction();
        await queryRunner.release();

        return savedPay;
    }



    async verifyPaymentWithTransaction(user: { sub: string }, payId: string) {
        const payment = await this.checkExistPay(payId);

        if (payment.order.user.id !== user.sub) throw new ForbiddenException("Você não tem permissão para alterar esse pedido");

        if (payment.status === PayStatusType.CONFIRMED) throw new BadRequestException("Pagamento já foi confirmado.");

        return await this.dataSource.transaction(async (manager) => {
            const isSuccess = Math.random() < 0.7;

            if (isSuccess) {
                payment.status = PayStatusType.CONFIRMED;
                await manager.save(payment);

                payment.order.status = OrderStatusType.PAID;
                await manager.save(payment.order);

                for (const item of payment.order.itensOrder) {
                    item.status = OrderStatusType.PAID;
                    item.ads.stock = item.ads.stock - item.quantify

                    await manager.save(item);
                    await manager.save(item.ads)
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

    async cancelPaymentWithTransaction(user: { sub: string }, payId: string) {
        const payment = await this.checkExistPay(payId);

        if (payment.order.user.id !== user.sub) throw new ForbiddenException("Você não tem permissão para alterar esse pedido");


        if (payment.status === PayStatusType.CANCELLED) throw new BadRequestException("Pagamento já foi cancelado.");

        return await this.dataSource.transaction(async (manager) => {
            if (payment.status === PayStatusType.CONFIRMED && payment.order.status !== OrderStatusType.SENT) {
                payment.status = PayStatusType.CANCELLED;
                await manager.save(payment);

                payment.order.status = OrderStatusType.CANCELLED;
                await manager.save(payment.order);

                for (const item of payment.order.itensOrder) {
                    item.status = OrderStatusType.CANCELLED;
                    item.ads.stock = item.ads.stock + item.quantify

                    await manager.save(item);
                    await manager.save(item.ads)
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

    async fetchPaymentByOrder(user: { sub: string }, orderId: string) {
        const payments = await this.payRepository.find({
            where: {
                order: {
                    id: orderId,
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

    async checkExistPay(payId: string) {
        const payment = await this.payRepository.findOne({
            where: { id: payId },
            relations: ['order', 'order.itensOrder', 'order.user', 'order.itensOrder.ads']
        });

        if (!payment) throw new NotFoundException("Pagamento não encontrado");

        return payment;
    }
}
import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderStatusType } from "src/entity/enum/orderStatus.enum";
import { Orders } from "src/entity/orders.entity";
import { CreateOrdersDTO, UpdateOrdersDTO } from "src/models/orders.dto";
import { Repository } from "typeorm";

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Orders)
        private ordersRepository: Repository<Orders>
    ) { }

    async createOrders(user: { sub: string }, orders: CreateOrdersDTO) {
        const { priceTotal } = orders;

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
            priceTotal
        }

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



    // async updateOrders(id: string, user: { sub: string }, orders: UpdateOrdersDTO) {
    //     const { title, description, categorie, stock, price, active } = orders;

    //     const existOrders = await this.checkExistOrders(id);

    //     if (existOrders.user.id !== user.sub) throw new ForbiddenException('Você não tem permissão para atualizar este anúncio');

    //     const newOrders = {
    //         title,
    //         description,
    //         categorie,
    //         stock,
    //         price,
    //         active
    //     }

    //     await this.ordersRepository.update(
    //         { id },
    //         newOrders
    //     );

    //     return newOrders;
    // }

    // async removeOrders(id: string) {
    //     const existOrders = await this.ordersRepository.findOne({
    //         where: { id },
    //         relations: ['itensOrder'],
    //     });

    //     if (!existOrders) throw new BadRequestException("Anúncio não encontrado")

    //     return await this.ordersRepository.remove(existOrders);
    // }

    private async checkExistOrders(id: string) {
        const orders = await this.ordersRepository.findOne({
            where: { id },
            relations: ['user', 'itensOrder', 'pay', 'reviews']
        })

        if (!orders) throw new BadRequestException("Pedido não encontrado")

        return orders
    }

}
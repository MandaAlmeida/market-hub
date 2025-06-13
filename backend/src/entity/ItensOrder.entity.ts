import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Orders } from "./orders.entity";
import { Ads } from "./ads.entity";
import { OrderStatusType } from "./enum/orderStatus.enum";

@Entity()
export class ItensOrder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Orders, order => order.itensOrder, { onDelete: 'CASCADE' })
    order: Orders;

    @ManyToOne(() => Ads, ads => ads.itensOrder, { onDelete: 'CASCADE' })
    ads: Ads;

    @Column()
    quantify: number;

    @Column()
    status: OrderStatusType

    @Column('decimal', { precision: 10, scale: 2 })
    unitPrice: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
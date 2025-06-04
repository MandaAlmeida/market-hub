import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Orders } from "./orders.entity";
import { Ads } from "./ads.entity";

@Entity()
export class ItensOrder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Orders, order => order.itensOrder, { onDelete: 'CASCADE' })
    order: Orders;

    @ManyToOne(() => Ads, ads => ads.itensOrder, { onDelete: 'CASCADE' })
    ads: Ads;

    @Column()
    quantify: string

    @Column()
    unitPrice: string
}
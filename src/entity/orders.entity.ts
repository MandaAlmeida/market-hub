import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { ItensOrder } from "./ItensOrder.entity";
import { Pay } from "./pay.entity";
import { Reviews } from "./reviews.entity";
import { OrderStatusType } from "./enum/orderStatus.enum";

@Entity()
export class Orders {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.ads, { onDelete: 'CASCADE' })
    user: User;

    @Column({
        type: 'enum',
        enum: OrderStatusType,
    })
    status: OrderStatusType

    @Column('decimal', { precision: 10, scale: 2 })
    priceTotal: number

    @OneToMany(() => ItensOrder, itensOrder => itensOrder.order, { cascade: true })
    itensOrder: ItensOrder[];

    @OneToMany(() => Pay, pay => pay.order, { cascade: true })
    pay: Pay[];

    @OneToMany(() => Reviews, review => review.order, { cascade: true })
    reviews: Reviews[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
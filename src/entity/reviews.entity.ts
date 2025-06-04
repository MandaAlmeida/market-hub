import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Orders } from "./orders.entity";

@Entity()
export class Reviews {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Orders, order => order.reviews, { onDelete: 'CASCADE' })
    order: Orders;

    @ManyToOne(() => User, user => user.reviews, { onDelete: 'CASCADE' })
    user: User;

    @Column()
    note: number;

    @Column()
    comment?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
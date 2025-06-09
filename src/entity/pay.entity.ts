import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Orders } from "./orders.entity";
import { PayType } from "./enum/pay.enum";
import { PayStatusType } from "./enum/payStatus.enum";

@Entity()
export class Pay {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Orders, order => order.pay, { onDelete: 'CASCADE' })
    order: Orders;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number

    @Column()
    payMethod: PayType

    @Column({
        type: 'enum',
        enum: PayStatusType
    })
    status: PayStatusType

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
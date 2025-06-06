import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { ItensOrder } from "./ItensOrder.entity";
import { Category } from "./category.entity";

@Entity()
export class Ads {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.ads, { onDelete: 'CASCADE' })
    user: User;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    price: string;

    @ManyToOne(() => Category, category => category.ads, { onDelete: 'CASCADE' })
    category: Category;

    @Column()
    stock: string;

    @Column()
    active: boolean;

    @OneToMany(() => ItensOrder, itensOrder => itensOrder.ads, { cascade: true })
    itensOrder: ItensOrder[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
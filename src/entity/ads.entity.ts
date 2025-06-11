import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { ItensOrder } from "./ItensOrder.entity";
import { SubCategory } from "./subcategory.entity";

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

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => SubCategory, subCategory => subCategory.ads, { onDelete: 'CASCADE' })
    subCategory: SubCategory;

    @Column({ type: 'integer', default: 0 })
    stock: number;

    @Column()
    active: boolean;

    @OneToMany(() => ItensOrder, itensOrder => itensOrder.ads, { cascade: true })
    itensOrder: ItensOrder[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
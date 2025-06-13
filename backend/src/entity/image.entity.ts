import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Orders } from "./orders.entity";
import { Ads } from "./ads.entity";
import { OrderStatusType } from "./enum/orderStatus.enum";

@Entity()
export class Image {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Ads, ads => ads.image, { onDelete: 'CASCADE' })
    ads: Ads;

    @Column()
    title: string;

    @Column()
    url: string;

    @Column()
    type: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
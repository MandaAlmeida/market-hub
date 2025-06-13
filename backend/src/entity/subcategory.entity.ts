import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Ads } from "./ads.entity";
import { Category } from "./category.entity";

@Entity()
export class SubCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Category, category => category.subCategory, { onDelete: 'CASCADE' })
    category: Category;

    @Column()
    name: string;

    @Column()
    slug: string;

    @Column()
    active: boolean;

    @OneToMany(() => Ads, ads => ads.subCategory, { cascade: true })
    ads: Ads[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
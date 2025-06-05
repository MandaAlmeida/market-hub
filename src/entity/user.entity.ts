import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserType } from './enum/userType.enum';
import { Ads } from './ads.entity';
import { Orders } from './orders.entity';
import { Reviews } from './reviews.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true, select: false })
    password: string;

    @Column({ nullable: true })
    address: string;

    @Column({
        type: 'enum',
        enum: UserType,
        nullable: true
    })
    type: UserType;

    @Column()
    provider: 'local' | 'google';

    @OneToMany(() => Ads, ads => ads.user, { cascade: true })
    ads: Ads[];

    @OneToMany(() => Orders, orders => orders.user, { cascade: true })
    orders: Orders[];

    @OneToMany(() => Reviews, review => review.user, { cascade: true })
    reviews: Reviews[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

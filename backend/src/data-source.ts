import { DataSource } from "typeorm";
import { config } from "dotenv";
config();

import { User } from "./entity/user.entity";
import { Ads } from "./entity/ads.entity";
import { ItensOrder } from "./entity/ItensOrder.entity";
import { Orders } from "./entity/orders.entity";
import { Pay } from "./entity/pay.entity";
import { Category } from "./entity/category.entity";
import { SubCategory } from "./entity/subcategory.entity";
import { Image } from "./entity/image.entity";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Ads, ItensOrder, Orders, Pay, Category, SubCategory, Image],
    synchronize: false,
    logging: false,
    ssl: { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' },
    migrations: ['src/migration/*.ts']
});

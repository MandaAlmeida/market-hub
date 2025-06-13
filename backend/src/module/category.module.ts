import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { CategoryController } from "src/controller/category.controller";
import { Category } from "src/entity/category.entity";
import { CategoryService } from "src/service/category.service";
import { UserModule } from "./user.module";
import { SubCategoryModule } from "./subCategory.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
        AuthModule,
        UserModule
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService]
})

export class CategoryModule { }
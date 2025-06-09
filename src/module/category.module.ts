import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { CategoryController } from "src/controller/category.controller";
import { Category } from "src/entity/category.entity";
import { CategoryService } from "src/service/category.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
        AuthModule
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: []
})

export class CategoryModule { }
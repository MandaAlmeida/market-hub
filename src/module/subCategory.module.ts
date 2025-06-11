import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
// import { SubCategoryController } from "src/controller/subcategory.controller";
import { SubCategory } from "src/entity/subcategory.entity";
import { SubCategoryService } from "src/service/subcategory.service";
import { UserModule } from "./user.module";
import { SubCategoryController } from "src/controller/subcategory.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([SubCategory]),
        AuthModule,
        UserModule
    ],
    controllers: [SubCategoryController],
    providers: [SubCategoryService],
    exports: [SubCategoryService]
})

export class SubCategoryModule { }
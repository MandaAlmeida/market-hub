import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/decorator/roles.decorator";
import { RoleGuard } from "src/guards/roles.guard";
import { CreateCategoryDTO, UpdateCategoryDTO } from "src/models/category.dto";
import { CategoryService } from "src/service/category.service";

@Controller("category")
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RoleGuard)
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ) { }

    @Roles("ADMIN")
    @Post()
    async createCategory(@Body() category: CreateCategoryDTO) {
        return this.categoryService.createCategory(category)
    }

    @Get()
    async fetchCategoru() {
        return this.categoryService.getCategories()
    }

    @Put(":id")
    async updateCategory(@Param("id") id: string, @Body() category: UpdateCategoryDTO) {
        return this.categoryService.updateCategory(id, category)
    }

    @Roles("ADMIN")
    @Delete(":id")
    async removeCategory(@Param("id") id: string) {
        return this.categoryService.removeCategory(id)
    }
}
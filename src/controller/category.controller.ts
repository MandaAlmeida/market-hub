import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateCategoryDTO } from "src/models/category.dto";
import { CategoryService } from "src/service/category.service";

@Controller("category")
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ) { }

    @Post()
    async createCategory(@Body() category: CreateCategoryDTO) {
        return this.categoryService.createCategory(category)
    }

    @Get()
    async fetchCategoru() {
        return this.categoryService.getCategories()
    }
}
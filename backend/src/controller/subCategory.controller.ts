import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "src/decorator/roles.decorator";
import { RoleGuard } from "src/guards/roles.guard";
import { CreateSubCategoryDTO, UpdateSubCategoryDTO } from "src/models/subcategory.dto";
import { SubCategoryService } from "src/service/subcategory.service";

@Controller("subcategory")
@ApiBearerAuth('access-token')
@UseGuards(RoleGuard)
export class SubCategoryController {
    constructor(
        private subCategoryService: SubCategoryService
    ) { }

    @Roles("ADMIN")
    @Post()
    async createSubCategory(@Body() subCategory: CreateSubCategoryDTO) {
        return this.subCategoryService.createSubCategory(subCategory)
    }

    @Roles("ADMIN")
    @Post("/createSubCategories")
    async createSubCategories(@Body() subCategory: CreateSubCategoryDTO[]) {
        return this.subCategoryService.createSubCategories(subCategory)
    }

    @Get()
    async fetchSubCategory() {
        return this.subCategoryService.getSubCategories()
    }

    @Put(":id")
    async updateSubCategory(@Param("id") id: string, @Body() subCategory: UpdateSubCategoryDTO) {
        return this.subCategoryService.updateSubCategory(id, subCategory)
    }

    @Roles("ADMIN")
    @Delete(":id")
    async removeSubCategory(@Param("id") id: string) {
        return this.subCategoryService.removeSubCategory(id)
    }
}
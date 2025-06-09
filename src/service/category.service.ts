import { ConflictException, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/entity/category.entity";
import { CreateCategoryDTO } from "src/models/category.dto";
import { Repository } from "typeorm";

@Injectable()
export class CategoryService implements OnModuleInit {
    private categoriesCache: Category[] = [];

    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) { }

    async onModuleInit() {
        await this.loadCategoriesIntoCache();
    }

    async createCategory(category: CreateCategoryDTO) {
        const { name, slug } = category;

        const existCategory = await this.categoryRepository.findOne({
            where: { name }
        });

        if (existCategory) throw new ConflictException("Essa categoria já existe");

        const newCategory = {
            name,
            slug,
            active: true
        }

        const createNewCategory = await this.categoryRepository.save(newCategory)
        await this.loadCategoriesIntoCache();

        return createNewCategory;
    }

    async getCategories() {
        return this.categoriesCache;
    }

    private async loadCategoriesIntoCache() {
        this.categoriesCache = await this.categoryRepository.find();
    }
}
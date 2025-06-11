import { ConflictException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import slugify from "slugify";
import { Category } from "src/entity/category.entity";
import { CreateCategoryDTO, UpdateCategoryDTO } from "src/models/category.dto";
import { Repository } from "typeorm";
import { SubCategoryService } from "./subcategory.service";

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
        const { name } = category;

        // Verifica se já existe uma categoria com o mesmo nome
        const existCategory = await this.categoryRepository.findOne({
            where: { name }
        });

        if (existCategory) throw new ConflictException("Essa categoria já existe");


        // Gera o slug baseado no nome, em minúsculas e sem caracteres especiais
        const slug = slugify(name, { lower: true });

        // Cria o objeto da nova categoria
        const newCategory = {
            name,
            slug,
            active: true
        };

        // Salva no banco de dados
        const createNewCategory = await this.categoryRepository.save(newCategory);

        // Atualiza o cache se estiver utilizando
        await this.loadCategoriesIntoCache();

        return createNewCategory;
    }

    async getCategories() {
        return this.categoriesCache;
    }

    async fetchCategory(id: string) {
        const existCategory = await this.checkExistCategory(id)

        return existCategory;
    }

    async updateCategory(id: string, categoryDTO: UpdateCategoryDTO) {
        const { name, active } = categoryDTO;

        const existCategory = await this.checkExistCategory(id);

        // Verifica nome duplicado (se name foi enviado)
        if (name && name !== existCategory.name) {
            const existCategoryByName = await this.categoryRepository.findOne({ where: { name } });

            if (existCategoryByName && existCategoryByName.id !== existCategory.id) throw new ConflictException("Já existe uma categoria com esse nome");


            existCategory.name = name;
        }

        if (typeof active === 'boolean') {
            existCategory.active = active;
        }

        await this.categoryRepository.save(existCategory);
        await this.loadCategoriesIntoCache();
        return existCategory;
    }

    async removeCategory(id: string) {
        const existCategory = await this.checkExistCategory(id)

        existCategory.active = false
        const category = await this.categoryRepository.save(existCategory);
        await this.loadCategoriesIntoCache();
        return category;
    }

    private async loadCategoriesIntoCache() {
        this.categoriesCache = await this.categoryRepository.find({ where: { active: true } });
    }

    private async checkExistCategory(id: string) {
        const category = await this.categoryRepository.findOne({ where: { id } });

        if (!category) throw new NotFoundException("Categoria não encontrado");

        return category
    }
}
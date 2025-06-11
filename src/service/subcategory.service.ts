import { ConflictException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import slugify from "slugify";
import { SubCategory } from "src/entity/subcategory.entity";
import { CreateSubCategoryDTO, UpdateSubCategoryDTO } from "src/models/subcategory.dto";
import { DataSource, Repository } from "typeorm";
import { Category } from "src/entity/category.entity";

@Injectable()
export class SubCategoryService implements OnModuleInit {
    private subcategoriesCache: SubCategory[] = [];

    constructor(
        @InjectRepository(SubCategory)
        private subcategoryRepository: Repository<SubCategory>,
        private dataSource: DataSource,
    ) { }

    async onModuleInit() {
        await this.loadSubCategoriesIntoCache();
    }

    async createSubCategory(subcategory: CreateSubCategoryDTO) {
        const { name, category } = subcategory;

        // Verifica se já existe uma categoria com o mesmo nome
        const existSubCategory = await this.subcategoryRepository.findOne({
            where: { name }
        });

        if (existSubCategory) throw new ConflictException("Essa subcategoria já existe");

        const existCategory = await this.checkExistsCategory(category);

        // Gera o slug baseado no nome, em minúsculas e sem caracteres especiais
        const slug = slugify(name, { lower: true });

        // Cria o objeto da nova categoria
        const newSubCategory = {
            name,
            slug,
            category: existCategory,
            active: true
        };

        // Salva no banco de dados
        const createNewSubCategory = await this.subcategoryRepository.save(newSubCategory);

        // Atualiza o cache se estiver utilizando
        await this.loadSubCategoriesIntoCache();

        return createNewSubCategory;
    }

    async getSubCategories() {
        return this.subcategoriesCache;
    }

    async fetchSubCategory(id: string) {
        const existSubCategory = await this.checkExistSubCategory(id)

        return existSubCategory;
    }

    async updateSubCategory(id: string, subcategoryDTO: UpdateSubCategoryDTO) {
        const { name, active, category } = subcategoryDTO;

        const existSubCategory = await this.checkExistSubCategory(id);

        if (name && name !== existSubCategory.name) {
            const existSubCategoryByName = await this.subcategoryRepository.findOne({ where: { name } });

            if (existSubCategoryByName && existSubCategoryByName.id !== existSubCategory.id) {
                throw new ConflictException("Já existe uma categoria com esse nome");
            }

            existSubCategory.name = name;
        }

        if (typeof active === 'boolean') {
            existSubCategory.active = active;
        }

        if (category) {
            const existCategory = await this.checkExistsCategory(category);
            existSubCategory.category = existCategory;
        }

        await this.subcategoryRepository.save(existSubCategory);
        await this.loadSubCategoriesIntoCache();
        return existSubCategory;
    }


    async removeSubCategory(id: string) {
        const existSubCategory = await this.checkExistSubCategory(id)

        existSubCategory.active = false
        const subcategory = await this.subcategoryRepository.save(existSubCategory);
        await this.loadSubCategoriesIntoCache();
        return subcategory;
    }

    private async loadSubCategoriesIntoCache() {
        this.subcategoriesCache = await this.subcategoryRepository.find({ where: { active: true } });
    }

    private async checkExistSubCategory(id: string) {
        const subcategory = await this.subcategoryRepository.findOne({ where: { id } });

        if (!subcategory) throw new NotFoundException("SubCategoria não encontrado");

        return subcategory
    }

    private async checkExistsCategory(category: string) {
        const categoryRepository = this.dataSource.getRepository(Category);
        const existCategory = await categoryRepository.findOne({ where: { id: category } });

        if (!existCategory) throw new NotFoundException("Categoria relacionada não encontrada");

        return existCategory;
    }
}
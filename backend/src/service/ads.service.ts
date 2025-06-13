import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Ads } from "src/entity/ads.entity";
import { CreateAdsDTO, UpdateAdsDTO } from "src/models/ads.dto";
import { Repository } from "typeorm";
import { CategoryService } from "./category.service";
import { UploadService } from "./upload.service";
import { SubCategoryService } from "./subcategory.service";

@Injectable()
export class AdsService {
    constructor(
        @InjectRepository(Ads)
        private adsRepository: Repository<Ads>,
        private subCategoryService: SubCategoryService,
        private uploadService: UploadService
    ) { }

    async createAds(user: { sub: string }, ads: CreateAdsDTO, files: Express.Multer.File[]) {
        const { title, description, subCategory, price, stock } = ads;

        const existAds = await this.checkSimilarAd(ads);

        if (existAds === 'identical') {
            throw new BadRequestException('Você já criou um anúncio idêntico.');
        }

        if (existAds === 'similar') {
            console.warn('Aviso: Você já tem um anúncio parecido. Tem certeza que quer criar outro?');
        }

        const existSubCategory = await this.subCategoryService.fetchSubCategory(subCategory);

        const newAdEntity = this.adsRepository.create({
            user: { id: user.sub },
            title,
            description,
            subCategory: existSubCategory,
            price,
            stock,
            active: true,
        });

        const newAd = await this.adsRepository.save(newAdEntity);

        // Verifica se há arquivos para upload
        if (files && files.length > 0) await this.uploadService.upload(files, newAd.id);

        return newAd;
    }

    async findOne(id: string) {
        const ads = this.checkExistAds(id)

        return ads;
    }

    async findAll(subCategory?: string, page: number = 1, limit: number = 10) {
        console.log(subCategory)
        const queryBuilder = this.adsRepository.createQueryBuilder('ads');

        queryBuilder
            .leftJoinAndSelect('ads.user', 'user')
            .leftJoinAndSelect('ads.subCategory', 'subCategory')
            .leftJoinAndSelect('ads.image', 'image')
            .where('ads.active = :active', { active: true });

        if (subCategory) {
            queryBuilder.andWhere('ads.subCategory = :subCategory', { subCategory });
        }

        const [items, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            data: items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async updateAds(id: string, user: { sub: string }, ads: UpdateAdsDTO) {
        const { title, description, subCategory, stock, price, active } = ads;

        const existAds = await this.checkExistAds(id);

        if (existAds.user.id !== user.sub) throw new ForbiddenException('Você não tem permissão para atualizar este anúncio');

        const existSubCategory = await this.subCategoryService.fetchSubCategory(subCategory);

        const newAds = {
            title,
            description,
            subCategory: existSubCategory,
            stock,
            price,
            active
        }

        await this.adsRepository.update(
            { id },
            newAds
        );

        return newAds;
    }

    async removeAds(id: string) {
        const existAds = await this.adsRepository.findOne({
            where: { id },
            relations: ['itensOrder'],
        });

        if (!existAds) throw new NotFoundException("Anúncio não encontrado")

        return await this.adsRepository.remove(existAds);
    }

    private async checkSimilarAd(ads: CreateAdsDTO): Promise<'identical' | 'similar' | null> {
        const { title, description, subCategory, price } = ads;

        // Verifica se existe um anúncio idêntico
        const identicalAd = await this.adsRepository.findOne({
            where: { title, description, price, subCategory: { id: subCategory } },
        });

        if (identicalAd) {
            return 'identical';
        }

        // Verifica se existe um anúncio parecido (mesmo título e categoria)
        const similarAd = await this.adsRepository.findOne({
            where: { title, subCategory: { id: subCategory } },
        });

        if (similarAd) {
            return 'similar';
        }

        return null;
    }

    async checkExistAds(id: string) {
        const ads = await this.adsRepository.findOne({
            where: { id },
            relations: ['user', "subCategory", "image"]
        })

        if (!ads) throw new NotFoundException("Anúncio não encontrado")

        return ads
    }

}
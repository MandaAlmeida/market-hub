import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery } from "@nestjs/swagger";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/decorator/roles.decorator";
import { RoleGuard } from "src/guards/roles.guard";
import { CreateAdsDTO, UpdateAdsDTO } from "src/models/ads.dto";
import { AdsService } from "src/service/ads.service";

@Controller("ads")
@ApiBearerAuth('access-token')
export class AdsController {
    constructor(private readonly adsService: AdsService) { }

    @Post()
    @Roles('SELLER')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'imagens', maxCount: 5 }
    ]))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Smartphone Galaxy S21' },
                description: { type: 'string', example: 'Novo, lacrado' },
                price: { type: 'number', example: 1999.90 },
                subCategory: { type: 'string', example: '770264c3-b7b4-40ac-8f74-478f2ae95d0a' },
                stock: { type: 'number', example: 50 },
                imagens: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    })

    async createAds(
        @CurrentUser() user: { sub: string },
        @Body(new ValidationPipe({ transform: true })) ads: CreateAdsDTO,
        @UploadedFiles() files: { imagens?: Express.Multer.File[] }
    ) {
        return this.adsService.createAds(user, ads, files?.imagens || []);
    }


    @Get(":id")
    async findOneAds(@Param("id") id: string) {
        return this.adsService.findOne(id);
    }

    @Get()
    @ApiQuery({ name: 'c', required: false, description: 'Nome da categoria' })
    @ApiQuery({ name: 'p', required: false, description: 'Número da página', type: Number })
    @ApiQuery({ name: 'l', required: false, description: 'Limite de itens por página', type: Number })
    async findAllAds(@Query("c") categorie?: string, @Query("p") page?: number, @Query("l") limit?: number) {
        return this.adsService.findAll(categorie, page, limit);
    }

    @Roles("SELLER")
    @Put(":id")
    @UseGuards(JwtAuthGuard, RoleGuard)
    async updateAds(@Param("id") id: string, @CurrentUser() user: { sub: string }, @Body() ads: UpdateAdsDTO) {
        return this.adsService.updateAds(id, user, ads)
    }

    @Roles("SELLER")
    @Delete(":id")
    @UseGuards(JwtAuthGuard, RoleGuard)
    async removeAds(@Param("id") id: string) {
        return this.adsService.removeAds(id)
    }

}
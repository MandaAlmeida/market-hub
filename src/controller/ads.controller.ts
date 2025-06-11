import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/decorator/roles.decorator";
import { RoleGuard } from "src/guards/roles.guard";
import { CreateAdsDTO, UpdateAdsDTO } from "src/models/ads.dto";
import { AdsService } from "src/service/ads.service";

@Controller("ads")
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RoleGuard)
export class AdsController {
    constructor(private readonly adsService: AdsService) { }

    @Roles("SELLER")
    @Post()
    async createAds(@CurrentUser() user: { sub: string }, @Body() ads: CreateAdsDTO) {
        return this.adsService.createAds(user, ads);
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
    async updateAds(@Param("id") id: string, @CurrentUser() user: { sub: string }, @Body() ads: UpdateAdsDTO) {
        return this.adsService.updateAds(id, user, ads)
    }

    @Roles("SELLER")
    @Delete(":id")
    async removeAds(@Param("id") id: string) {
        return this.adsService.removeAds(id)
    }

}
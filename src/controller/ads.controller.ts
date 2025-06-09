import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from "src/decorator/roles.decorator";
import { RoleGuard } from "src/guards/roles.guard";
import { CreateAdsDTO, UpdateAdsDTO } from "src/models/ads.dto";
import { AdsService } from "src/service/ads.service";

@Controller("ads")
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
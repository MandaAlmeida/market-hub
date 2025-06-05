import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreateAdsDTO, UpdateAdsDTO } from "src/models/ads.dto";
import { AdsService } from "src/service/ads.service";

@Controller("ads")
@UseGuards(JwtAuthGuard)
export class AdsController {
    constructor(private readonly adsService: AdsService) { }

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

    @Put(":id")
    async updateAds(@Param("id") id: string, @CurrentUser() user: { sub: string }, @Body() ads: UpdateAdsDTO) {
        return this.adsService.updateAds(id, user, ads)
    }

    @Delete(":id")
    async removeAds(@Param("id") id: string) {
        return this.adsService.removeAds(id)
    }

}
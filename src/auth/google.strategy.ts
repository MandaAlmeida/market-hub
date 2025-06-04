import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from "@nestjs/config";  // Apenas ConfigService

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private configService: ConfigService
    ) {
        super({
            clientID: configService.get<string>('CLIENT_ID_GOOGLE') || '',
            clientSecret: configService.get<string>('CLIENT_SECRET_GOOGLE') || '',
            callbackURL: configService.get<string>('URL_GOOGLE') || '',
            scope: ['email', 'profile']
        });

    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
    ) {
        const { emails, name } = profile;

        done(null, {
            email: emails[0].value,
            name: name.givenName,
        });
    }
}

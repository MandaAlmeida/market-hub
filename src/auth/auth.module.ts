import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { GoogleStrategy } from "./google.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const privateKeyString = configService.get<string>("JWT_PRIVATE_KEY") || "";
                const publicKeyString = configService.get<string>("JWT_PUBLIC_KEY") || "";

                return {
                    privateKey: Buffer.from(privateKeyString, "base64"),
                    publicKey: Buffer.from(publicKeyString, "base64"),
                    signOptions: {
                        algorithm: "RS256",
                    },
                };
            },
        }),
    ],
    providers: [JwtStrategy, GoogleStrategy],
    exports: [JwtModule, PassportModule, GoogleStrategy],
})
export class AuthModule { }

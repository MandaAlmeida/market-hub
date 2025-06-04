import { Module } from '@nestjs/common';
import { UserController } from 'src/controller/user.controller';
import { UserService } from 'src/service/user.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';


@Module({
  imports: [AuthModule,
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }

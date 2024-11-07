import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAuthService } from "./user-auth.service";
import { UserAuthController } from "./user-auth.controller";
import { UserAuthRepository } from "./user-auth.repository";
import { User } from "src/entities/user.entity";
import { UsersModule } from "../user/user.module";
import { MailModule } from "../mail/mail.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), UsersModule, MailModule],
    controllers: [UserAuthController],
    providers: [UserAuthService, UserAuthRepository],
    exports: [UserAuthService]
})
export class UserAuthModule {}
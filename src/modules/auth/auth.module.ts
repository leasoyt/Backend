import { Module } from "@nestjs/common";
import { UsersModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MailService } from "../mail/mail.service";

@Module({
    imports: [UsersModule],
    controllers: [AuthController],
    providers: [AuthService,MailService]
})
export class AuthModule { }
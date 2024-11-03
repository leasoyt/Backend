import { Module } from "@nestjs/common";
import { UsersModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MailModule } from "../mail/mail.module";

@Module({
    imports: [UsersModule, MailModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }
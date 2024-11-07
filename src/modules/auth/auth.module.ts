import { Module } from "@nestjs/common";
import { UsersModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MailModule } from "../mail/mail.module";
import { RestaurantModule } from "../restaurant/restaurant.module";

@Module({
    imports: [UsersModule, MailModule, RestaurantModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }
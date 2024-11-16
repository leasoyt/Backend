import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { UserAuthRepository } from "./user-auth.repository";
import { AuthRequestDto } from "src/dtos/auth/auth0.request.dto";
import { SanitizedUserDto } from "src/dtos/user/sanitized-user.dto";
import { User } from "src/entities/user.entity";
import { UserService } from "../user/user.service";
import { isNotEmpty } from "class-validator";
import { LoginResponseDto } from "src/dtos/auth/login-response.dto";
import { MailService } from "../mail/mail.service";
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";
import { TryCatchWrapper } from "src/decorators/generic-error.decorator";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserAuthService {

    constructor(
        private readonly userAuthRepository: UserAuthRepository,
        private readonly userService: UserService,
        private readonly mailService: MailService,
        private readonly jwtService: JwtService
    ) { }


    @TryCatchWrapper(HttpMessagesEnum.LOGIN_FAIL, BadRequestException)
    async loginWithAuth(obj: AuthRequestDto): Promise<LoginResponseDto> {
        const user: User | undefined = await this.userService.getUserBySub(obj.sub);

        if (user !== undefined && user !== null) {

            if (user.was_deleted) {
                throw { error: HttpMessagesEnum.USER_DELETED, exception: BadRequestException };
            }

            if (obj.sub !== user.sub) {
                throw { error: "Invalid subject identification" };
            }

            const token = this.jwtService.sign({
                id: user.id,
                email: user.email,
                role: user.role,
            });

            return {
                message: HttpMessagesEnum.LOGIN_SUCCESS,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    country: user.country,
                    profile_image: user.profile_image,
                    role: user.role,
                    was_deleted: user.was_deleted,
                },
            };

        } else {
            return await this.registerWithAuth(obj);
        }
    }


    @TryCatchWrapper(HttpMessagesEnum.REGISTRATION_FAIL, BadRequestException)
    async registerWithAuth(obj: AuthRequestDto): Promise<LoginResponseDto> {
        const { email, picture, name, sub } = obj;

        const is_existent: User | undefined = await this.userService.getUserByMail(email);

        if (isNotEmpty(is_existent)) {
            throw { error: 'Este correo ya esta registrado!', exception: ConflictException };
        }

        const user: Partial<SanitizedUserDto> = {
            email,
            profile_image: picture,
            name,
            sub
        };

        const created_user = await this.userAuthRepository.createUser(user);

        const token = this.jwtService.sign({
            id: created_user.id,
            email: created_user.email,
            role: created_user.role,
        });

        try {
            await this.mailService.sendWelcomeEmail(created_user);
        } catch (error) {
            console.error('Error sending welcome email:', error);
        }

        return {
            message: HttpMessagesEnum.REGISTRATION_SUCCESS,
            token,
            user: {
                id: created_user.id,
                name: created_user.name,
                email: created_user.email,
                country: created_user.country,
                profile_image: created_user.profile_image,
                role: created_user.role,
                was_deleted: created_user.was_deleted,
            },
        };

    }
}
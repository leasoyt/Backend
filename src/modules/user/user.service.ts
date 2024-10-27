/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { isEmpty } from "class-validator";
import { User } from "src/entities/user.entity";
import { UserRepository } from "./user.repository";
import { UpdateUserDto } from "src/dtos/user/update-user.dto";
import { SanitizedUserDto } from "src/dtos/user/sanitized-user.dto";
import { RegisterDto } from "src/dtos/auth/register.dto";
import * as bcrypt from "bcrypt";
import { UserRole } from "src/enums/roles.enum";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { config as dotenvConfig } from 'dotenv';
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";
import { TryCatchWrapper } from "src/decorators/generic-error.decorator";
import { UserProfileDto } from "src/dtos/user/profile-user.dto";

dotenvConfig({ path: './env' });

@Injectable()
export class UserService {

    constructor(private readonly userRepository: UserRepository, private readonly httpService: HttpService) { }

    @TryCatchWrapper(HttpMessagesEnum.RESOURCE_NOT_FOUND, NotFoundException)
    async getProfile(userID: string): Promise<UserProfileDto> {
        const user: User = await this.getRawUserById(userID);
        const { id, role, ...rest } = user;

        return rest;
    }

    async rankUpTo(id: string, role: UserRole): Promise<User> {
        const found_user: User = await this.getRawUserById(id);
        const ranked_up: User | undefined = await this.userRepository.rankUpTo(found_user, role);

        if (ranked_up === undefined) {
            throw { error: HttpMessagesEnum.RANKING_UP_FAIL };
        }

        return ranked_up;
    }

    @TryCatchWrapper(HttpMessagesEnum.UNKNOWN_ERROR, InternalServerErrorException)
    async getUsers(page: number, limit: number): Promise<Omit<User, "password">[]> {
        const found_users: Omit<User, "password">[] = await this.userRepository.getUsers(page, limit);

        if (found_users.length === 0) {
            throw {error: "Users list is empty", exception: NotFoundException};
        }
        return found_users;
    }

    @TryCatchWrapper(HttpMessagesEnum.USER_UPDATE_FAILED, BadRequestException)
    async updateUser(id: string, modified_user: UpdateUserDto): Promise<SanitizedUserDto> {
        const found_user: User | undefined = await this.userRepository.getUserById(id);

        if (isEmpty(found_user)) {
            throw { error: "user not found", exception: NotFoundException };
        }

        const updated_user: User = await this.userRepository.updateUser(found_user, modified_user);
        const { password, isAdmin, ...filtered_user } = updated_user;

        return filtered_user;
    }

    async updatePassword(id: string, oldPassword: string, newPassword: string): Promise<SanitizedUserDto> {

        const user = await this.getRawUserById(id);
        const is_valid_password = await bcrypt.compare(oldPassword, user.password);

        if (is_valid_password) {
            const hashed_password = await bcrypt.hash(newPassword, 10);
            const updated_user: SanitizedUserDto = await this.updateUser(id, { password: hashed_password });
            return updated_user;

        }

        throw { error: "Old password is incorrect", UnauthorizedException };
    }

    async createUser(userObject: Omit<RegisterDto, "confirmPassword">): Promise<SanitizedUserDto> {
        const created_user: User = await this.userRepository.createUser(userObject);
        const { password, isAdmin, ...filtered } = created_user;

        return filtered;
    }

    @TryCatchWrapper(HttpMessagesEnum.RESOURCE_NOT_FOUND, BadRequestException)
    async getUserById(id: string): Promise<SanitizedUserDto> {
        const { password, isAdmin, ...filtered_user } = await this.getRawUserById(id);
        return filtered_user;
    }

    async getRawUserById(id: string): Promise<User> {
        const user: User | undefined = await this.userRepository.getUserById(id);

        if (isEmpty(user)) {
            throw { error: "User not found with the provided id", exception: NotFoundException };
        }
        return user;
    }

    async getUserByMail(mail: string): Promise<User | undefined> {
        const user: User | undefined = await this.userRepository.getUserByMail(mail);
        return user ? user : undefined;
    }

    async deleteUser(id: string): Promise<SanitizedUserDto> {
        const to_delete: User | undefined = await this.userRepository.getUserById(id);
        return await this.userRepository.deleteUser(to_delete);
    }

    // Para asignarle un Rol a un usuario de Auth0
    async assignRoleUser(idUserAuth0: string, rol: UserRole) {
        let roleId: string;
        const managerRolId: string = 'rol_jpBPeHyzDQ1DUuhV';
        const waiterRolId: string = 'rol_C5w7SEkBGdqxoQL8';
        // if(rol === UserRole.MANAGER) {
        roleId = 'rol_jpBPeHyzDQ1DUuhV';
        // await this.deleteRolUser(idUserAuth0, consumerRolId);
        // } else if (rol === UserRole.WAITER) {
        //     roleId = 'rol_C5w7SEkBGdqxoQL8';
        // }
        const userId = 'auth0|6719d2b707c0856cec1febf0';
        const accessToken = process.env.MGMT_API_ACCESS_TOKENAUTH0
        const domain = 'https://dev-0p5tgtzfost47liw.us.auth0.com/'
        const options = {
            method: 'POST',
            url: `${domain}api/v2/users/${userId}/roles`,
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${accessToken}`,
                'cache-control': 'no-cache'
            },
            data: { roles: [roleId] }
        };
        try {
            const response = await firstValueFrom(this.httpService.request(options));
            console.log(response)
            return response.data;
        } catch (error) {
            console.log('todo salió mal')
            console.error(error);
            throw new BadRequestException('Problema con el servidor de Auth0')
        }
    }

    // Para quitar un Rol a un usuario de Auth0
    async deleteRolUser(idUserAuth0: string, idAuth0Rol: string) {
        const userId = 'auth0|6719d2b707c0856cec1febf0';
        const accessToken = process.env.MGMT_API_ACCESS_TOKENAUTH0
        const domain = 'https://dev-0p5tgtzfost47liw.us.auth0.com/'
        const options = {
            method: 'DELETE',
            url: `${domain}api/v2/users/${userId}/roles`,
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${accessToken}`,
                'cache-control': 'no-cache'
            },
            data: { roles: [idAuth0Rol] }
        };
        try {
            const response = await firstValueFrom(this.httpService.request(options));
            console.log(response)
            return response.data;
        } catch (error) {
            console.log('todo salió mal')
            console.error(error);
            throw error; // Maneja el error según tus necesidades
        }
    }

    async addSubscriptionToUser(emailUser: string, idSubscription: string){
        const foundedUser: User =  await this.getUserByMail(emailUser);
        await this.userRepository.addSubscriptionToUser(foundedUser, idSubscription)
    }

    async updateSubscriptionStatus(idSubscription: string, statusSubscription: string) {
        await this.userRepository.updateSubscriptionStatus(statusSubscription, idSubscription);
    }
}
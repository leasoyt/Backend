/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { isEmpty } from "class-validator";
import { User } from "src/entities/user.entity";
import { UserRepository } from "./user.repository";
import { UpdateUserDto } from "src/dtos/user/update-user.dto";
import { SanitizedUserDto } from "src/dtos/user/sanitized-user.dto";
import { RegisterDto } from "src/dtos/auth/register.dto";
import * as bcrypt from "bcrypt";
import { UserRole } from "src/enums/roles.enum";
import { CustomMessagesEnum } from "src/dtos/custom-responses.dto";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: './env' });

@Injectable()
export class UserService {

    constructor(private readonly userRepository: UserRepository, private readonly httpService: HttpService) { }

    async rankUpTo(id: string, role: UserRole): Promise<User> {
        try {
            const found_user: User = await this.getRawUserById(id);
            const ranked_up: User = await this.userRepository.rankUpTo(found_user, role);
            return ranked_up;
        } catch (err) {
            throw new BadRequestException({ message: CustomMessagesEnum.RANKING_UP_FAIL, error: err.error });
        }
    }

    async updateUser(id: string, modified_user: UpdateUserDto): Promise<SanitizedUserDto> {
        const found_user: User | undefined = await this.userRepository.getUserById(id);

        if (isEmpty(found_user)) {
            throw new NotFoundException({ message: CustomMessagesEnum.UPDATE_USER_FAILED, error: "user not found" });
        }

        try {
            const updated_user: User = await this.userRepository.updateUser(found_user, modified_user);
            const { password, isAdmin, ...filtered_user } = updated_user;

            return filtered_user;
        } catch (err) {
            throw new BadRequestException({ message: CustomMessagesEnum.UPDATE_USER_FAILED, error: err });
        }

    }

    async updatePassword(id: string, oldPassword: string, newPassword: string): Promise<SanitizedUserDto> {

        try {
            const user = await this.getRawUserById(id);
            const is_valid_password = await bcrypt.compare(oldPassword, user.password);
            
            if(is_valid_password){
                const hashed_password = await bcrypt.hash(newPassword, 10);
                const updated_user: SanitizedUserDto = await this.updateUser(id, { password: hashed_password });
                return updated_user;

            }

            throw { error: "Old password is incorrect" };

        } catch (err) {
            throw new BadRequestException({ message: CustomMessagesEnum.UPDATE_PASSWORD_FAIL, error: err.error });
        }


    }

    async createUser(userObject: Omit<RegisterDto, "confirmPassword">): Promise<SanitizedUserDto> {
        try {
            const created_user: User = await this.userRepository.createUser(userObject);
            const { password, isAdmin, ...filtered } = created_user;

            return filtered;
        } catch (err) {
            throw new BadRequestException({ message: CustomMessagesEnum.REGISTRATION_FAIL, error: err })
        }
    }

    async getUserById(id: string): Promise<SanitizedUserDto> {

        try {
            const { password, isAdmin, ...filtered_user } = await this.getRawUserById(id);

            return filtered_user;
        } catch (err) {
            throw new NotFoundException({message: CustomMessagesEnum.RESOURCE_NOT_FOUND, error: err.error });
        }
    }

    async getRawUserById(id: string): Promise<User> {
        const user: User | undefined = await this.userRepository.getUserById(id);

        if (isEmpty(user)) {
            throw { error: "User not found with the provided id" };
        }
        return user;
    }

    async getUserByMail(mail: string): Promise<User | undefined> {
        const user: User | undefined = await this.userRepository.getUserByMail(mail);

        if (isEmpty(user)) {
            return undefined;
        }
        return user;
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
            data: {roles: [roleId]}
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
            data: {roles: [idAuth0Rol]}
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
}
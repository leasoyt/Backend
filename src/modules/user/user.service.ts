/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { isEmpty } from "class-validator";
import { User } from "src/entities/user.entity";
import { UserRepository } from "./user.repository";
import { UpdateUserDto } from "src/dtos/user/update-user.dto";
import { SanitizedUserDto } from "src/dtos/user/sanitized-user.dto";
import { RegisterDto } from "src/dtos/auth/register.dto";
import * as bcrypt from "bcrypt";
import { UserRole } from "src/enums/roles.enum";
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";
import { HandleError } from "src/decorators/generic-error.decorator";
import { UserProfileDto } from "src/dtos/user/profile-user.dto";

@Injectable()
export class UserService {

    constructor(private readonly userRepository: UserRepository) { }

    @HandleError(HttpMessagesEnum.RESOURCE_NOT_FOUND, NotFoundException)
    async getProfile(userID: string): Promise<UserProfileDto> {
        const user: User = await this.getRawUserById(userID);
        const { id, role, ...rest } = user;

        return rest;
    }

    async rankUpTo(id: string, role: UserRole): Promise<User> {
        try {
            const found_user: User = await this.getRawUserById(id);
            const ranked_up: User | undefined = await this.userRepository.rankUpTo(found_user, role);

            if (ranked_up === undefined) {
                throw { error: "Ranking up failed" };
            }

            return ranked_up;
        } catch (err) {
            throw { error: err?.error || "Something went wrong" };
        }
    }

    @HandleError(HttpMessagesEnum.UNKNOWN_ERROR, InternalServerErrorException)
    async getUsers(page: number, limit: number): Promise<Omit<User, "password">[]> {
        return await this.userRepository.getUsers(page, limit);
    }

    @HandleError(HttpMessagesEnum.USER_UPDATE_FAILED, BadRequestException)
    async updateUser(id: string, modified_user: UpdateUserDto): Promise<SanitizedUserDto> {
        const found_user: User | undefined = await this.userRepository.getUserById(id);

        if (isEmpty(found_user)) {
            throw new NotFoundException({ message: HttpMessagesEnum.USER_UPDATE_FAILED, error: "user not found" });
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

        throw { error: "Old password is incorrect" };

    }

    @HandleError(HttpMessagesEnum.REGISTRATION_FAIL, BadRequestException)
    async createUser(userObject: Omit<RegisterDto, "confirmPassword">): Promise<SanitizedUserDto> {
        const created_user: User = await this.userRepository.createUser(userObject);
        const { password, isAdmin, ...filtered } = created_user;

        return filtered;
    }

    @HandleError(HttpMessagesEnum.RESOURCE_NOT_FOUND, NotFoundException)
    async getUserById(id: string): Promise<SanitizedUserDto> {
        const { password, isAdmin, ...filtered_user } = await this.getRawUserById(id);
        return filtered_user;
    }

    async getRawUserById(id: string): Promise<User> {
        const user: User | undefined = await this.userRepository.getUserById(id);

        if (isEmpty(user)) {
            throw { error: "User not found with the provided id" };
        }
        return user;
    }

    async getUserByMail(mail: string): Promise<User> {
        const user: User | undefined = await this.userRepository.getUserByMail(mail);

        if (isEmpty(user)) {
            throw { error: "User email not registered" };
        }
        return user;
    }

    async deleteUser(id: string): Promise<SanitizedUserDto> {
        const to_delete: User | undefined = await this.userRepository.getUserById(id);
        return await this.userRepository.deleteUser(to_delete);
    }

}
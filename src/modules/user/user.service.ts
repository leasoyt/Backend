/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { isEmpty } from "class-validator";
import { User } from "src/entities/user.entity";
import { UserRepository } from "./user.repository";
import { UpdateClientDto } from "src/dtos/client/updateClient.dto";

@Injectable()
export class UserService {

    constructor(private readonly userRepository: UserRepository) { }

    async updateUser(id: string, modified_user: UpdateClientDto): Promise<Omit<User, "password" | "isAdmin" | "reservations">> {
        const found_user: User | undefined = await this.userRepository.getUserById(id);

        if (isEmpty(found_user)) {
            throw new NotFoundException("Failed to update, user not found");
        }

        try {
            const updated_user: User = await this.userRepository.updateUser(found_user, modified_user);
            const { password, isAdmin, reservations, ...filtered_user } = updated_user;

            return filtered_user;
        } catch (err) {
            throw new BadRequestException("Something went wrong trying to update user");
        }

    }

    async getUserById(id: string): Promise<Omit<User, "password" | "isAdmin" | "reservations">> {
        const user: User | undefined = await this.userRepository.getUserById(id);

        if (isEmpty(user)) {
            throw new NotFoundException(`User not found with the provided id: ${id}`);
        }
        const { password, isAdmin, reservations, ...filtered_user } = user;

        return filtered_user;
    }

    async deleteUser(id: string): Promise<any> {
        const to_delete: User | undefined = await this.userRepository.getUserById(id);

        if(isEmpty(to_delete)) {
            throw new NotFoundException(`Failed to delete, user not found: ${id}`);
        }
        return await this.userRepository.deleteUser(to_delete);
    }

}
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isEmpty } from "class-validator";
import { UpdateUserDto } from "src/dtos/gerente/updateUser.dto";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository {

    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async getUserById(id: string): Promise<User | undefined> {
        const found_user: User | null = await this.userRepository.findOne({where: {id: id}});
        return found_user === null? undefined : found_user;
    }

    async updateUser(actual_user: User, modified_user: UpdateUserDto): Promise<User> {
        this.userRepository.merge(actual_user, modified_user);
        await this.userRepository.save(actual_user);

        return actual_user;
    }

    async deleteUser(to_delete: User): Promise<any> {

        const deletion_result: User = await this.userRepository.remove(to_delete);

        if(isEmpty(deletion_result)) {
            throw new InternalServerErrorException(`Something went wrong trying to delete user: ${to_delete.id}`);
        }

        return deletion_result;

    }

}
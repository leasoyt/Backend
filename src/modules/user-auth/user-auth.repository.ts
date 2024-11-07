import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { AccountType } from "src/enums/account.type.enum";
import { Repository } from "typeorm";

@Injectable()
export class UserAuthRepository {
    
    constructor(@InjectRepository(User) private authUserRepository: Repository<User>) { }

    async createUser(authObject: Partial<User>): Promise<User> {
        const created_user: User = await this.authUserRepository.create({...authObject, account_type: AccountType.AUTH});
        return await this.authUserRepository.save(created_user);
    }
}
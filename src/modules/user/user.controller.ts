import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Put } from "@nestjs/common";
import { UpdateUserDto } from "src/dtos/user/updateUser.dto";
import { UserService } from "./user.service";
import { isNotEmptyObject } from "class-validator";
import { ApiTags } from "@nestjs/swagger";
import { SanitizedUserDto } from "src/dtos/user/sanitizedUser.dto";

@ApiTags("User")
@Controller("user")
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get(":id")
    async getUser(@Param("id", ParseUUIDPipe) id: string): Promise<SanitizedUserDto> {
        return await this.userService.getUserById(id);
    }

    @Put(":id")
    async updateUser(@Param("id", ParseUUIDPipe) id: string, @Body() modified_user: UpdateUserDto): Promise<SanitizedUserDto> {
        if (!isNotEmptyObject(modified_user)) {
            throw new BadRequestException("body values are empty");
        }

        return await this.userService.updateUser(id, modified_user);
    }

    @Delete(":id")
    async deleteUser(@Param("id", ParseUUIDPipe) id: string): Promise<any> {
        return await this.userService.deleteUser(id);
    }

}
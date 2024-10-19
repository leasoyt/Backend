import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Put } from "@nestjs/common";
import { UpdateUserDto } from "src/dtos/user/update-user.dto";
import { UserService } from "./user.service";
import { isNotEmpty, isNotEmptyObject } from "class-validator";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SanitizedUserDto } from "src/dtos/user/sanitized-user.dto";

@ApiTags("User")
@Controller("user")
export class UserController {

    constructor(private readonly userService: UserService) { }


    @Get(":id")
    @ApiOperation({ summary: "obtiene un usuario por su id" })
    async getUser(@Param("id", ParseUUIDPipe) id: string): Promise<SanitizedUserDto> {
        return await this.userService.getUserById(id);
    }

    @Put(":id")
    @ApiOperation({ summary: "actualiza la informacion de un usuario, por id y body" })
    @ApiBody({
        schema: {
            example: {
                name: 'Tim Haward',
                country: "Noruega"
            }
        }
    })
    async updateUser(@Param("id", ParseUUIDPipe) id: string, @Body() modified_user: UpdateUserDto): Promise<SanitizedUserDto> {
        if (!isNotEmptyObject(modified_user)) {
            throw new BadRequestException("body values are empty");
        }

        if (isNotEmpty(modified_user.password)) {
            throw new BadRequestException("You can't modify passwords in this endpoint!");
        }

        return await this.userService.updateUser(id, modified_user);
    }

    @Delete(":id")
    @ApiOperation({ summary: "elimina un usuario por su id (posiblemente no se vaya a usar)" })
    async deleteUser(@Param("id", ParseUUIDPipe) id: string): Promise<any> {
        return await this.userService.deleteUser(id);
    }

}
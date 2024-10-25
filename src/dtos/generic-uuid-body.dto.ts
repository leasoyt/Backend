import { IsNotEmpty, IsUUID } from "class-validator";

export class UuidBodyDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;
}
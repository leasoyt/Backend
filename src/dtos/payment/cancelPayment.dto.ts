import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsUUID } from "class-validator"

export class CancelSubscriptionDto{
    @IsNotEmpty()
    @IsString()
    @ApiProperty({description: 'id de la suscripción a cancelar'})
    idSubscription: string
}
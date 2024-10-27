import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { SubscriptionOptions } from "src/enums/subscriptionOptions.enum";

export class CreatePaymentDto {
  @ApiProperty({ description: 'email del usuario al que se asociará el pago' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({ enum: SubscriptionOptions, description: 'Opción de la suscripción elegida' })
  @IsEnum(SubscriptionOptions)
  @IsNotEmpty()
  subscription: string;
}

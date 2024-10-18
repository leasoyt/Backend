import { IntersectionType, OmitType } from "@nestjs/swagger";
import { User } from "src/entities/user.entity";

/**
 * Dto: User seguro, sin propiedades (isAdmin, password);
 */
export class SanitizedUserDto extends IntersectionType(OmitType(User, ["isAdmin", "password"] as const)){}

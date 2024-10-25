import { OmitType } from "@nestjs/swagger";
import { SanitizedUserDto } from "./sanitized-user.dto";

export class UserProfileDto extends OmitType(SanitizedUserDto, ["id", "role"]) {

}
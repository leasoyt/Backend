import { PartialType } from "@nestjs/swagger";
import { RegisterClientDto } from "./registerClient.dto";

export class UpdateClientDto extends PartialType(RegisterClientDto){}
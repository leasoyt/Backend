import { PartialType } from "@nestjs/swagger";
import { RegisterClientDot } from "./registerClient.dto";

export class UpdateClientDto extends PartialType(RegisterClientDot){}
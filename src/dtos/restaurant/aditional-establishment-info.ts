import { UpdateMenuDto } from "../menu/update-menu.dto"
import { UpdateWaiterDto } from "./updateWaiter.dto"


// Información adicional para la actualización
export class AditionalEstablishmentInfo {
    manager: string
    waiter_list: UpdateWaiterDto[]
    menu: UpdateMenuDto
}
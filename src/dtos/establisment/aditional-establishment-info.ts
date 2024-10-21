//import { UpdateMenuDto } from '';
import { UpdateWaiterDto } from '../restaurant/updateWaiter.dto';

// Información adicional para la actualización   ../menu/update-menu.dto
export class AditionalEstablishmentInfo {
  manager: string;
  waiter_list: UpdateWaiterDto[];
  //menu: UpdateMenuDto
}

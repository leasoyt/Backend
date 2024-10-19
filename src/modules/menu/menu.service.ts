import { Injectable } from "@nestjs/common";
import { MenuRepository } from "./menu.repository";
import { CreateMenuDto } from "src/dtos/menu/create-menu.dto";

@Injectable()
export class MenuService{
  
    constructor(private menuRepository:MenuRepository){}

 createMenu(menu:CreateMenuDto,restaurantId:string){
    return this.menuRepository.createMenu(menu,restaurantId)
}

getMenu(restaurantId: string) {
   return this.menuRepository.getMenu(restaurantId)
}


}
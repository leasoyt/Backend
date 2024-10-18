import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Menu } from "src/entities/menu.entity";
import { Repository } from "typeorm";

@Injectable()
export class MenuRepository{
    constructor(@InjectRepository(Menu) private menuRepository: Repository<Menu>){}
    async getMenuById(id: string): Promise<null | Menu> {
        const foundMenu: null | Menu = await this.menuRepository.findOneBy({id})
        return foundMenu;
    }
}
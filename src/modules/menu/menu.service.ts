import { Injectable } from "@nestjs/common";
import { MenuRepository } from "./menu.repository";

@Injectable()
export class MenuService {
    constructor(private menuRepository: MenuRepository) { }




}
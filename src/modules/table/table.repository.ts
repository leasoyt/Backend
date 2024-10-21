import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "src/entities/restaurant.entity";
import { Restaurant_Table } from "src/entities/tables.entity";
import { Repository } from "typeorm";

@Injectable()
export class TableRepository {

    constructor(@InjectRepository(Restaurant_Table) private tableRepository: Repository<Restaurant_Table>) { }

    // async addTable(restaurantInstance: Restaurant, tableNumber: number): Promise<Restaurant_Table[]> {

    // }

    // async deleteTable(tableInstance: Restaurant_Table, restaurantInstance: Restaurant): Promise<Restaurant_Table> {

    // }

    async getTable(tableId: string, restaurant: Restaurant): Promise<Restaurant_Table> {
        const found_table: null | Restaurant_Table = await this.tableRepository.findOne({where: {id: tableId, restaurant: restaurant}});

        return found_table === null ? undefined : found_table;
    }

}
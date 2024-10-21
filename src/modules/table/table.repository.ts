import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isNotEmpty } from "class-validator";
import { Restaurant } from "src/entities/restaurant.entity";
import { Restaurant_Table } from "src/entities/tables.entity";
import { Repository } from "typeorm";

@Injectable()
export class TableRepository {

    constructor(@InjectRepository(Restaurant_Table) private tableRepository: Repository<Restaurant_Table>) { }

    async addTable(restaurantInstance: Restaurant, tableNumber: number): Promise<Restaurant_Table| undefined> {
        const created_table: Restaurant_Table | null = this.tableRepository.create({number: tableNumber, restaurant: restaurantInstance});
        if(!isNotEmpty(created_table)){
            return undefined;
        }
        return await this.tableRepository.save(created_table);
    }

    async deleteTable(tableInstance: Restaurant_Table): Promise<Restaurant_Table | undefined> {
        const deleted_table: Restaurant_Table = await this.tableRepository.remove(tableInstance);
        return deleted_table === null ? undefined : deleted_table;
    }

    async getTablesByRestaurant(restaurantInstance: Restaurant): Promise<Restaurant_Table[] | undefined> {
        const found_tables: Restaurant_Table[] | null = await this.tableRepository.find({ where: { restaurant: restaurantInstance } });
        return found_tables === null ? undefined : found_tables;
    }

    async getTable(id: string): Promise<Restaurant_Table> {
        const found_table: null | Restaurant_Table = await this.tableRepository.findOne({ where: { id: id } });
        return found_table === null ? undefined : found_table;
    }

}
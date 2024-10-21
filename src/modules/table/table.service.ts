import { Injectable, NotFoundException } from "@nestjs/common";
import { Restaurant_Table } from "src/entities/tables.entity";
import { RestaurantService } from "../restaurant/restaurant.service";
import { TableRepository } from "./table.repository";
import { Restaurant } from "src/entities/restaurant.entity";

@Injectable()
export class TableService {
    getTableById(table: string): Restaurant_Table | PromiseLike<Restaurant_Table> {
        throw new Error("Method not implemented.");
    }

    constructor(private readonly tableRepository: TableRepository, private readonly restaurantService: RestaurantService) {}

    // async getTable(id: string, restaurant: Restaurant): Promise<Restaurant_Table> {
    //     const found_table: undefined | Restaurant_Table = await this.tableRepository.getTable(id, restaurant);
    //     if(found_table === undefined) {
    //         throw new NotFoundException(`Can't find table with id: ${id}, from the establishment: ${restaurant.id}`);
    //     }

    //     return found_table;
    // }

    // async getRestaurantTables(id: string): Promise<Restaurant_Table[]> {

    // }

    // async addTable(restaurantId: string, tableNumber: number): Promise<Restaurant_Table[]> {
    //     const restaurant: Restaurant = await this.restaurantService.getRestaurantById(restaurantId);
    //     await this.tableRepository.addTable(restaurant, tableNumber);
    // }

    // async deleteTable(tableId: string, restaurantId: string): Promise<Restaurant_Table[]> {
    //     const restaurant: Restaurant = await this.restaurantService.getRestaurantById(restaurantId);

    //     const table: Restaurant_Table = await this.getTable(tableId, restaurant);

    //     const deletion_result: Restaurant_Table = await this.tableRepository.deleteTable(tableId, restaurant);
    // }
}
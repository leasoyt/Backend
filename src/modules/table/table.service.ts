import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Restaurant_Table } from "src/entities/tables.entity";
import { RestaurantService } from "../restaurant/restaurant.service";
import { TableRepository } from "./table.repository";
import { Restaurant } from "src/entities/restaurant.entity";

@Injectable()
export class TableService {

    constructor(private readonly tableRepository: TableRepository, private readonly restaurantService: RestaurantService) { }

    async getTableById(id: string): Promise<Restaurant_Table> {
        const found_table: undefined | Restaurant_Table = await this.tableRepository.getTable(id);
        if (found_table === undefined) {
            throw new NotFoundException(`Can't find table with id: ${id}`);
        }

        return found_table;
    }

    async getRestaurantTables(restaurantId: string): Promise<Restaurant_Table[]> {
        const restaurant: Restaurant = await this.restaurantService.getRestaurantById(restaurantId);
        const found_tables: undefined | Restaurant_Table[] = await this.tableRepository.getTablesByRestaurant(restaurant);

        if (found_tables === undefined) {
            throw new NotFoundException("No tables found from this establishment");
        }

        return found_tables;
    }

    async addTable(restaurantId: string, tableNumber: number): Promise<Restaurant_Table[]> {
        const restaurant: Restaurant = await this.restaurantService.getRestaurantById(restaurantId);
        const created_table: Restaurant_Table | undefined = await this.tableRepository.addTable(restaurant, tableNumber);

        if(created_table === undefined) {
            throw new InternalServerErrorException("Failed to add a new table, something went wrong");
        }

        return await this.getRestaurantTables(restaurantId);
    }

    async deleteTable(restaurantId: string, tableId: string): Promise<Restaurant_Table[]> {
        const table: Restaurant_Table = await this.getTableById(tableId);
        const deletion_result: Restaurant_Table | undefined = await this.tableRepository.deleteTable(table);

        if (deletion_result === undefined) {
            throw new InternalServerErrorException("Something went wrong trying to delete table");
        }

        return await this.getRestaurantTables(restaurantId);
    }
}
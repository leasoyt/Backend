import { BadRequestException, Injectable } from "@nestjs/common";
import { Restaurant_Table } from "src/entities/tables.entity";
import { RestaurantService } from "../restaurant/restaurant.service";
import { TableRepository } from "./table.repository";
import { Restaurant } from "src/entities/restaurant.entity";
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";
import { HttpResponseDto } from "src/dtos/http-response.dto";
import { TryCatchWrapper } from "src/decorators/generic-error.decorator";

@Injectable()
export class TableService {

    constructor(private readonly tableRepository: TableRepository, private readonly restaurantService: RestaurantService) { }

    async getTableById(id: string): Promise<Restaurant_Table> {
        const found_table: undefined | Restaurant_Table = await this.tableRepository.getTable(id);

        if (found_table === undefined) {
            throw { error: "Can't find table with provided id" };
        }

        return found_table;
    }

    async getRestaurantTables(restaurantId: string): Promise<Restaurant_Table[]> {
        const restaurant: Restaurant = await this.restaurantService.getRestaurantById(restaurantId);
        const found_tables: undefined | Restaurant_Table[] = await this.tableRepository.getTablesByRestaurant(restaurant);

        if (found_tables === undefined) {
            throw { error: "No tables found from this establishment" };
        }

        return found_tables;
    }

    @TryCatchWrapper(HttpMessagesEnum.TABLE_CREATION_FAIL, BadRequestException)
    async addTable(restaurantId: string, tableNumber: number): Promise<Restaurant_Table[]> {
        const restaurant: Restaurant = await this.restaurantService.getRestaurantById(restaurantId);
        const created_table: Restaurant_Table | undefined = await this.tableRepository.addTable(restaurant, tableNumber);

        if (created_table === undefined) {
            throw { error: "Something went wrong" };
        }

        return await this.getRestaurantTables(restaurantId);
    }

    @TryCatchWrapper(HttpMessagesEnum.TABLE_DELETION_FAIL, BadRequestException)
    async deleteTable(restaurantId: string, tableId: string): Promise<HttpResponseDto> {
        const table: Restaurant_Table = await this.getTableById(tableId);
        const deletion_result: Restaurant_Table | undefined = await this.tableRepository.deleteTable(table);

        if (deletion_result === undefined) {
            throw { error: "Something went wrong" };
        }

        return { message: HttpMessagesEnum.TABLE_DELETION_SUCCESS };
    }
}
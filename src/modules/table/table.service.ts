/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Restaurant_Table } from "src/entities/tables.entity";
import { RestaurantService } from "../restaurant/restaurant.service";
import { TableRepository } from "./table.repository";
import { Restaurant } from "src/entities/restaurant.entity";
import { HttpMessagesEnum } from "src/enums/httpMessages.enum";
import { HttpResponseDto } from "src/dtos/http-response.dto";
import { TryCatchWrapper } from "src/decorators/generic-error.decorator";
import { TableResponseDto } from "src/dtos/table/table-response.dto";

@Injectable()
export class TableService {

    constructor(private readonly tableRepository: TableRepository, private readonly restaurantService: RestaurantService) { }

    async getTableById(id: string, restaurantId?: string): Promise<TableResponseDto> {
        try {
            const found_table: Restaurant_Table = await this.getRawTableById(id, restaurantId);
            return this.formatTable(found_table);
        } catch (err) {
            throw err;
        }
    }

    async getRawTableById(id: string, restaurantId?: string): Promise<Restaurant_Table> {
        const found_restaurant: Restaurant | null = restaurantId ? await this.restaurantService.getRestaurantById(restaurantId) : null;
        const found_table: undefined | Restaurant_Table = await this.tableRepository.getTable(id, found_restaurant);

        if (found_table === undefined) {
            throw { error: HttpMessagesEnum.TABLE_NOT_FOUND, exception: NotFoundException };
        }

        return found_table;
    }

    @TryCatchWrapper(HttpMessagesEnum.RESOURCE_NOT_FOUND, NotFoundException)
    async getRestaurantTables(restaurantId: string): Promise<TableResponseDto[]> {
        const restaurant: Restaurant = await this.restaurantService.getRestaurantById(restaurantId);
        const found_tables: undefined | Restaurant_Table[] = await this.tableRepository.getTablesByRestaurant(restaurant);

        if (found_tables.length === 0) {
            throw { error: HttpMessagesEnum.NO_TABLES_IN_RESTAURANT, exception: NotFoundException };
        }

        return found_tables.map((x) => {
            return this.formatTable(x);
        });
    }

    private formatTable(unFormated: Restaurant_Table): TableResponseDto {
        try {
            const { id, status, restaurant, number, reservations, order } = unFormated;
            return { id, status, number, order: order?.id || undefined };
        } catch (err) {
            throw { error: `${err}` };
        }
    }

    @TryCatchWrapper(HttpMessagesEnum.TABLE_CREATION_FAIL, BadRequestException)
    async addTable(restaurantId: string, tableNumber: number): Promise<HttpResponseDto> {
        const restaurant: Restaurant = await this.restaurantService.getRestaurantById(restaurantId);
        const created_table: Restaurant_Table | undefined = await this.tableRepository.addTable(restaurant, tableNumber);

        if (created_table === undefined) {
            throw { error: "Something went wrong" };
        }

        return { message: HttpMessagesEnum.TABLE_CREATED_SUCCESSFULLY };
    }

    @TryCatchWrapper(HttpMessagesEnum.TABLE_DELETION_FAIL, BadRequestException)
    async deleteTable(tableId: string): Promise<HttpResponseDto> {
        const table: Restaurant_Table = await this.getRawTableById(tableId);
        const deletion_result: Restaurant_Table | undefined = await this.tableRepository.deleteTable(table);

        if (deletion_result === undefined) {
            throw { error: "Something went wrong" };
        }

        return { message: HttpMessagesEnum.TABLE_DELETION_SUCCESS };
    }
}
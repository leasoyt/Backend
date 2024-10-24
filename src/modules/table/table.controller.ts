import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Restaurant_Table } from "src/entities/tables.entity";
import { TableService } from "./table.service";
import { TableCreationDto } from "src/dtos/table/table-creation.dto";
import { TableDeletionDto } from "src/dtos/table/table-deletion.dto";

@ApiTags("Tables")
@Controller("table")
export class TableController {
    constructor(private readonly tableService: TableService) { }

    @Get("single/:id")
    @ApiOperation({ summary: "Conseguir una mesa por id", description: "Uuid de la mesa" })
    async getTableById(@Param("id", ParseUUIDPipe) id: string): Promise<Restaurant_Table> {
        return await this.tableService.getTableById(id)
    }

    @Get("many/:id")
    @ApiOperation({ summary: "Conseguir una lista de las mesas", description: "Uuid del restaurante" })
    async getTables(@Param("id", ParseUUIDPipe) id: string): Promise<Restaurant_Table[]> {
        return await this.tableService.getRestaurantTables(id);
    }

    @Post("add")
    @ApiBody({
        schema: {
            example: {
                restaurant_id: "uuid...",
                table_number: 10
            }
        }
    })
    @ApiOperation({ summary: "Añadir una nueva mesa al restaurante", description: "Uuid del restaurante y numero de la mesa 0 - 1000" })
    async addTable(@Body() tableOjbect: TableCreationDto): Promise<Restaurant_Table[]> {
        return await this.tableService.addTable(tableOjbect.restaurant_id, tableOjbect.table_number);
    }

    @Delete("remove")
    @ApiBody({
        schema: {
            example: {
                restaurant_id: "uuid...",
                table_id: "uuid..."
            }
        }
    })
    @ApiOperation({ summary: "Eliminar una mesa del restaurante", description: "Uuid del restaurante y la mesa, para mas seguridad" })
    async deleteTable(@Body() tableObject: TableDeletionDto): Promise<Restaurant_Table[]> {
        return await this.tableService.deleteTable(tableObject.restaurant_id, tableObject.table_id);
    }
}
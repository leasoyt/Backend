import { Body, Controller, Delete, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Restaurant_Table } from "src/entities/tables.entity";
import { TableService } from "./table.service";
import { TableCreationDto } from "src/dtos/table/table-creation.dto";
import { TableDeletionDto } from "src/dtos/table/table-deletion.dto";

@ApiTags("Tables")
@Controller("table")
export class TableController {
    constructor(private readonly tableService: TableService){}

    @Post("add")
    @ApiOperation({ summary: "Añadir una nueva mesa al restaurante", description: "Uuid del negocio y numero de la tabla 0 - 1000" })
    async addTable(@Body() tableOjbect: TableCreationDto): Promise<Restaurant_Table[]> {
        return await this.tableService.addTable(tableOjbect.restaurant_id, tableOjbect.table_number);
    }

    @Delete("remove")
    @ApiOperation({ summary: "Eliminar una mesa del restaurante", description: "Uuid del negocio y uuid de la mesa" })
    async deleteTable(@Body() tableObject: TableDeletionDto): Promise<Restaurant_Table[]> {
        return await this.tableService.deleteTable(tableObject.table_id, tableObject.restaurant_id);
    }
}
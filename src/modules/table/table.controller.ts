import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Restaurant_Table } from 'src/entities/tables.entity';
import { TableService } from './table.service';
import { TableCreationDto } from 'src/dtos/table/table-creation.dto';
import { TableDeletionDto } from 'src/dtos/table/table-deletion.dto';
import { UserRole } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { TryCatchWrapper } from 'src/decorators/generic-error.decorator';
import { HttpMessagesEnum } from 'src/enums/httpMessages.enum';
import { HttpResponseDto } from 'src/dtos/http-response.dto';

@ApiTags('Tables')
@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) { }

  @Get(':id')
  @ApiBearerAuth()
  @TryCatchWrapper(HttpMessagesEnum.RESOURCE_NOT_FOUND, NotFoundException)
  @ApiOperation({ summary: 'Conseguir una mesa por id', description: 'id de la mesa' })
  async getTableById(@Param('id', ParseUUIDPipe) id: string,): Promise<Restaurant_Table> {
    return await this.tableService.getTableById(id);
  }

  @Get('all/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Conseguir una lista de las mesas', description: 'Uuid del negocio' })
  async getTables(@Param('id', ParseUUIDPipe) id: string,): Promise<Restaurant_Table[]> {
    return await this.tableService.getRestaurantTables(id);
  }

  @Post('add')
  @ApiBearerAuth()
  @Roles(UserRole.MANAGER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBody({
    schema: {
      example: {
        restaurant_id: 'uuid...',
        table_number: 10,
      },
    },
  })
  @ApiOperation({ summary: 'Añadir una nueva mesa al restaurante', description: 'Uuid del negocio y numero de la mesa 0 - 1000' })
  async addTable(@Body() tableOjbect: TableCreationDto): Promise<Restaurant_Table[]> {
    return await this.tableService.addTable(tableOjbect.restaurant_id, tableOjbect.table_number);
  }

  @Delete('remove')
  @ApiBearerAuth()
  @Roles(UserRole.MANAGER, UserRole.CONSUMER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBody({
    schema: {
      example: {
        restaurant_id: 'uuid...',
        table_id: 'uuid...',
      },
    },
  })
  @ApiOperation({ summary: 'Eliminar una mesa del restaurante', description: 'Uuid del negocio y uuid de la mesa', })
  async deleteTable(@Body() tableObject: TableDeletionDto): Promise<HttpResponseDto> {
    return await this.tableService.deleteTable(tableObject.restaurant_id, tableObject.table_id);
  }

}

import { Body, Controller, Delete, Get, NotFoundException, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TableService } from './table.service';
import { TableNumberDto } from 'src/dtos/table/table-creation.dto';
import { TableDeletionDto } from 'src/dtos/table/table-deletion.dto';
import { UserRole } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { TryCatchWrapper } from 'src/decorators/generic-error.decorator';
import { HttpMessagesEnum } from 'src/enums/httpMessages.enum';
import { HttpResponseDto } from 'src/dtos/http-response.dto';
import { TableResponseDto } from 'src/dtos/table/table-response.dto';

@ApiTags('Tables')
@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) { }

  @Get(':id')
  // @ApiBearerAuth()
  // @Roles(UserRole.MANAGER, UserRole.CONSUMER)
  // @UseGuards(AuthGuard, RolesGuard)
  @ApiParam({ name: "id", description: "ID del restaurante" })
  @ApiOperation({ summary: 'Conseguir una mesa y toda su informacion', description: 'id de la mesa' })
  @TryCatchWrapper(HttpMessagesEnum.RESOURCE_NOT_FOUND, NotFoundException)
  async getTableById(@Param('id', ParseUUIDPipe) id: string,): Promise<TableResponseDto> {
    return await this.tableService.getTableById(id);
  }

  @Get('all/:id')
  // @ApiBearerAuth()
  // @Roles(UserRole.MANAGER, UserRole.CONSUMER)
  // @UseGuards(AuthGuard, RolesGuard)
  @ApiParam({ name: "id", description: "ID del restaurante" })
  @ApiOperation({ summary: 'Conseguir una lista de las mesas', description: 'Uuid del negocio' })
  async getTables(@Param('id', ParseUUIDPipe) id: string,): Promise<TableResponseDto[]> {
    return await this.tableService.getRestaurantTables(id);
  }

  @Post('create/:id')
  // @ApiBearerAuth()
  // @Roles(UserRole.MANAGER)
  // @UseGuards(AuthGuard, RolesGuard)
  @ApiBody({
    schema: {
      example: {
        table_number: 10,
      }
    }
  })
  @ApiParam({ name: "id", description: "ID del restaurante" })
  @ApiOperation({ summary: 'Añadir una nueva mesa al restaurante', description: 'Uuid del negocio y numero de la mesa 0 - 1000' })
  async addTable(@Param("id", ParseUUIDPipe) id: string, @Body() tableOjbect: TableNumberDto): Promise<TableResponseDto[]> {
    return await this.tableService.addTable(id, tableOjbect.table_number);
  }

  @Delete('remove/:id')
  // @ApiBearerAuth()
  // @Roles(UserRole.MANAGER, UserRole.CONSUMER)
  // @UseGuards(AuthGuard, RolesGuard)
  @ApiBody({
    schema: {
      example: {
        restaurant_id: 'uuid...',
        table_id: 'uuid...',
      },
    },
  })
  @ApiOperation({ summary: 'Eliminar una mesa del restaurante', description: 'Uuid del negocio y uuid de la mesa', })
  async deleteTable(@Param("id", ParseUUIDPipe) id: string): Promise<HttpResponseDto> {
    return await this.tableService.deleteTable(id);
  }

}

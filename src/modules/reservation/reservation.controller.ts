import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReservationCreateDto } from 'src/dtos/reservation/reservation-create.dto';
import { UserRole } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { ReservationResponseDto } from 'src/dtos/reservation/reservation-response.dto';
import { HttpResponseDto } from 'src/dtos/http-response.dto';

@ApiTags('Reservation')
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

  @Get('user/:id')
  // @ApiBearerAuth()
  // @Roles(UserRole.MANAGER, UserRole.CONSUMER)
  // @UseGuards(AuthGuard)
  @ApiOperation({summary: "obtiene todas las reservas de un usuario", description: "id de usuario"})
  async getUserReservations(@Param('id', ParseUUIDPipe) id: string): Promise<ReservationResponseDto[]> {
    return await this.reservationService.getUserReservations(id);
  }

  @Get('restaurant/:id')
  @ApiBearerAuth()
  @Roles(UserRole.MANAGER)
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "obtiene todas las reservas de un restaurante", description: "id de restaurante"})
  async getRestaurantReservations(@Param("id", ParseUUIDPipe) id: string): Promise<ReservationResponseDto[]> {
    return await this.reservationService.getRestaurantReservations(id);
  }

  // @Get('table/:id')
  // // @ApiBearerAuth()
  // // @Roles(UserRole.MANAGER, UserRole.WAITER)
  // // @UseGuards(AuthGuard)
  // async getTableReservations(@Param('id', ParseUUIDPipe) id: string): Promise<ReservationResponseDto[]> {
  //   return await this.reservationService.getTableReservations(id);
  // }

  @Post('new')
  @ApiBearerAuth()
  @Roles(UserRole.MANAGER, UserRole.CONSUMER)
  @UseGuards(AuthGuard)
  @ApiBody({
    schema: {
      example: {
        user_id: '90b07572-524f-4acb-9c7b-4e7e31927643',
        restaurant_id: 'uuid',
        date: '2024-10-29 15:45:30',
        seats: 3,
      },
    },
  })
  @ApiOperation({summary: "crea una nueva reservacion", description: "objeto de reservacion"})
  async createReservation(@Body() reservationObject: ReservationCreateDto): Promise<ReservationResponseDto> {
    return await this.reservationService.createReservation(reservationObject);
  }

  // @Put('cancel/:id')
  // @Roles(UserRole.MANAGER, UserRole.CONSUMER)
  // @UseGuards(AuthGuard)
  // async cancelReservation(@Param('id') id: string): Promise<any> { }

  // @Put('complete/:id')
  // @ApiBearerAuth()
  // @Roles(UserRole.MANAGER, UserRole.WAITER)
  // @UseGuards(AuthGuard)
  // async completeReservation(@Param('id') id: string): Promise<any> { }


  @Delete('delete/:id')
  @ApiBearerAuth()
  @Roles(UserRole.MANAGER, UserRole.CONSUMER)
  @ApiOperation({summary: "Elimina una reserva del sistema", description: "id de reserva"})
  @UseGuards(AuthGuard)
  async deleteReservation(@Param('id') id: string): Promise<HttpResponseDto> { 
    return await this.reservationService.deleteReservation(id);
  }
}

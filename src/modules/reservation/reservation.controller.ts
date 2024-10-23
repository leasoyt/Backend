import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ApiTags } from '@nestjs/swagger';
import { Reservation } from 'src/entities/reservation.entity';
import { CreateReservationDto } from 'src/dtos/reservation/create-reservation.dto';
import { UserRole } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiTags('Reservation')
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('user/:id')
  @Roles(UserRole.MANAGER, UserRole.CONSUMER)
  @UseGuards(AuthGuard, RolesGuard)
  async getUserReservations(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Reservation[]> {
    return await this.reservationService.getUserReservations(id);
  }

  @Get('table/:id')
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @UseGuards(AuthGuard, RolesGuard)
  async getTableReservations(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Reservation[]> {
    return await this.reservationService.getTableReservations(id);
  }

  @Post()
  @Roles(UserRole.MANAGER, UserRole.CONSUMER)
  @UseGuards(AuthGuard, RolesGuard)
  async createReservation(
    @Body() reservationObject: CreateReservationDto,
  ): Promise<any> {
    return await this.reservationService.createReservation(reservationObject);
  }

  @Put('cancel/:id')
  @Roles(UserRole.MANAGER, UserRole.CONSUMER)
  @UseGuards(AuthGuard, RolesGuard)
  async cancelReservation(@Param('id') id: string): Promise<any> {}

  @Put('complete/:id')
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @UseGuards(AuthGuard, RolesGuard)
  async completeReservation(@Param('id') id: string): Promise<any> {}
}

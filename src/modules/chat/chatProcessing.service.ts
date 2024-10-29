import { Injectable } from "@nestjs/common";
import { ReservationCreateDto } from "src/dtos/reservation/reservation-create.dto";
import { RestaurantService } from "../restaurant/restaurant.service";
import { Restaurant } from "src/entities/restaurant.entity";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ReservationService } from "../reservation/reservation.service";

@Injectable()
export class ChatProcessingService {
	constructor(
		private readonly restaurantService: RestaurantService,
		private readonly reservationService: ReservationService,
	){}
  async createReservation(datosCapturados){
		const foundedRestaurant: Restaurant | null = await this.restaurantService.getRestaurantByName(datosCapturados.restaurant[0].value)
		console.log(foundedRestaurant)
		console.log(datosCapturados.restaurant[0].value)
		if (!foundedRestaurant) return 'Lo siento no pude crear la reservación con el restaurante indicado';
		const intentoCreateReservationDto: ReservationCreateDto  = {
			user_id: '5c6b54ae-ff5b-4662-a443-66bee0c452ff',
			restaurant_id: foundedRestaurant.id,
			date: datosCapturados.datetime[0].value,
			seats: Number(datosCapturados.seats[0].value)
		}
    const dtoObject = plainToInstance(ReservationCreateDto, intentoCreateReservationDto);
  	const errors = await validate(dtoObject);

  	if (errors.length > 0) {
    	// Mostrar los errores de validación
			console.log(errors)
    	return 'Lo siento no puede realizar la reservación'
  	} else {
			await this.reservationService.createReservation(intentoCreateReservationDto);
			return 'Reservación agendada correctamente'
  	}
  }
}
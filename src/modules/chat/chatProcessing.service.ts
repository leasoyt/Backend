import { Injectable } from "@nestjs/common";
import { ReservationCreateDto } from "src/dtos/reservation/reservation-create.dto";
import { RestaurantService } from "../restaurant/restaurant.service";
import { Restaurant } from "src/entities/restaurant.entity";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ReservationService } from "../reservation/reservation.service";
import { format, parseISO } from "date-fns";

@Injectable()
export class ChatProcessingService {
	constructor(
		private readonly restaurantService: RestaurantService,
		private readonly reservationService: ReservationService,
	){}

	private messages: { idCliente: string, restaurante?: string, date?: string, seats?: number }[] = [];

  async verificarDatosReservation(datosCapturados, idCliente: string){
		console.log(datosCapturados)
		console.log(this.messages)
		const datosNoCompletos = await this.validarDatosCompletos(datosCapturados, idCliente)
		let respuesta: {
			mensaje: string,
			confirmationRequire: boolean,
			datos: string
		}
		if (datosNoCompletos) {
			const respuestaFallida = {
				mensaje: datosNoCompletos,
				confirmationRequire: false,
				datos: 'Datos incompletos'
			}
			respuesta = respuestaFallida
		}	
		else {
			const datosPrevios = this.getMessagesForUser(idCliente)
			const respuestaAfirmativa = {
				mensaje: 'Por favor confirme su reservación',
				confirmationRequire: true,
				datos: `fecha: ${datosPrevios.date}, personas: ${datosPrevios.seats}, Restaurante: ${datosPrevios.restaurante}`
			}
			respuesta = respuestaAfirmativa
		}
		return respuesta;
  }

	async crearReservation(idCliente: string){
		
		// const restaurante: string = datosCapturados.restaurant[0].value;
		// const date = datosCapturados.datetime[0].value;
		// const seats = Number(datosCapturados.seats[0].value);


		const idUser = '0075b938-be8b-4516-94b9-e861a1446741';
		const datosPrevios = this.getMessagesForUser(idCliente);
		const restaurante: string = datosPrevios.restaurante;
		const date:string = datosPrevios.date;
		const seats: number = datosPrevios.seats;

		const foundedRestaurant: Restaurant | null = await this.restaurantService.getRestaurantByName(restaurante)
		if (!foundedRestaurant) return 'Lo siento no pude crear la reservación con el restaurante indicado';

		const isoDate = date;
		console.log(isoDate)
		const parsedDate = parseISO(isoDate);
		const formattedDate = format(parsedDate, 'yyyy-MM-dd HH:mm:ss');

		const intentoCreateReservationDto: ReservationCreateDto  = {
			user_id: '0075b938-be8b-4516-94b9-e861a1446741',
			restaurant_id: foundedRestaurant.id,
			date: formattedDate,
			seats: seats
		}
    const dtoObject = plainToInstance(ReservationCreateDto, intentoCreateReservationDto);
  	const errors = await validate(dtoObject);

  	if (errors.length > 0) {
    	// Mostrar los errores de validación
			console.log(errors)
    	return 'Lo siento no puede realizar la reservación'
  	} else {
		console.log('olasf')
			console.log(intentoCreateReservationDto)
			console.log(dtoObject)
			await this.reservationService.createReservation(dtoObject);
			this.clearMessagesForClient(idCliente)
			return 'Reservación agendada correctamente'
  	}
	}

	async validarDatosCompletos(datosCapturados, idCliente): Promise<string | null> {
		const restaurantNames =  (await this.restaurantService.getAllRestaurantNames()).join(', ')
		let estructuraSugeridaMensaje: string = '';
		let datosPrevios = this.getMessagesForUser(idCliente);
		if(!datosPrevios) {
			// estructuraSugeridaMensaje = ' Si lo deseas puedes usar el siguiente ejemplo y darme todos los datos juntos: Quiero una reserva para el día 22 de noviembre a las 10:00 am para el restaurante Taco bell para 2 personas'
			this.saveData(idCliente, {})
			datosPrevios = this.getMessagesForUser(idCliente)
		}
		console.log(datosPrevios)
		console.log(datosCapturados)
		const respuesta: string = 'Parece que deseas realizar una reservación'
		const datosFaltantes: string[] = []
		if (!datosCapturados.restaurant && !datosPrevios.restaurante) {
				// datosFaltantes.push(`Restaurante, por favor considera los restaurantes registrados: ${restaurantNames}`);
				return `${respuesta}, por favor dame el nombre del restaurante. Considera nuestros restaurantes registrados .${estructuraSugeridaMensaje}`
			}
			else if (datosCapturados.restaurant){
			console.log('res')
			// console.log(restaurant[0].value)
			const restuarante = {restaurante: datosCapturados.restaurant[0].value}
			this.saveData(idCliente, restuarante)
		}
		console.log('paso?')
		// console.log(date)
		if(!datosCapturados.datetime && !datosPrevios.date) {
			estructuraSugeridaMensaje = ' Ejemplo: Quiero una reservación para el día 23 de Octubre a las 16:00'
			return `${respuesta}, por favor dame la fecha y hora que deseas para realizar la reserva.${estructuraSugeridaMensaje}`
			// datosFaltantes.push('Fecha y hora');
		}	
		else if(datosCapturados.datetime){
			console.log('paso paso');
			// console.log(date[0].value)
			const fecha = {date: datosCapturados.datetime[0].value}
			this.saveData(idCliente, fecha)
		}
		if(!datosCapturados.seats && !datosPrevios.seats) {
			// datosFaltantes.push('Número de personas')
			estructuraSugeridaMensaje = ' Ejemplo: Quiero una reservación para 5 personas'
			return `${respuesta}, por favor dame el número de personas.${estructuraSugeridaMensaje}`
		}
		else if(datosCapturados.seats) {
			// console.log(seats[0].value)
			const sillas = {seats: Number(datosCapturados.seats[0].value)}
			this.saveData(idCliente, sillas)
		}
		// if (datosFaltantes.length > 0) {
		// 	return `Parece que deseas realizar una reservación, falta que me proporciones los siguientes datos: ${datosFaltantes.join(', ')}.${estructuraSugeridaMensaje}`
		// }
		else return
	}

	async getRestaurantsNames(): Promise<string> {
		const respuesta: string = 'Los restaurantes registrados en nuestra plataforma son: '
		const restaurantNames = (await this.restaurantService.getAllRestaurantNames()).join(', ')
		return respuesta + restaurantNames
	}

	async getUbicationRestaurant(datosCapturados){
		const restaurantNames =  (await this.restaurantService.getAllRestaurantNames()).join(', ');
		if(!datosCapturados.restaurant) return `No pude entender a que restaurante te refieres, por favor considera nuestros restaurantes registrados: ${restaurantNames}`
		const restaurantCapturado = datosCapturados.restaurant[0].value;
		const foundedRestaurant: Restaurant | undefined = await this.restaurantService.getRestaurantByName(restaurantCapturado);
		if(!foundedRestaurant) return `No pude encontrar el restaurante ${datosCapturados.restaurant[0].value}, por favor considera nuestros restaurantes registrados: ${restaurantNames}`
		return foundedRestaurant.address;
	}

	saveData(idCliente: string, data){
		const existingMessage = this.messages.find(msg => msg.idCliente === idCliente);
		console.log('primer inmre')

    if (existingMessage) {
      // Si ya existe, actualizar los campos correspondientes
      Object.assign(existingMessage, data);
    } else {
			console.log('debería llegar aca')
      // Si no existe, crear un nuevo objeto y agregarlo al array
      const newMessage = { idCliente, ...data };
      this.messages.push(newMessage);
		}
	} 


  clearMessagesForClient(clientId: string) {
    this.messages = this.messages.filter(
      msg => msg.idCliente !== clientId
    );
  }

  getMessagesForUser(userId: string) {
		console.log('si se llama')
    return this.messages.find(msg => msg.idCliente === userId);
  }
}
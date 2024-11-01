import { Injectable } from '@nestjs/common';
import { Wit } from 'node-wit';
import { config as dotenvConfig } from 'dotenv';
import { RestaurantService } from '../restaurant/restaurant.service';

dotenvConfig({ path: './env' });

@Injectable()
export class ChatService {
  constructor(private readonly restaurantService: RestaurantService) {}

  private messageHistory: {
    type: 'user' | 'bot';
    message: string;
    userId: string;
    timestamp: Date;
  }[] = [];

  private witClient: Wit;

  onModuleInit() {
    this.witClient = new Wit({
      accessToken: process.env.WITTOKEN,
    });
  }

  async processingMessage(mensaje: string, userId: string) {
    try {
      this.logMessage('user', mensaje, userId);

      const witResponse = await this.witClient.message(mensaje);
      console.log('Respuesta de Wit.ai:', JSON.stringify(witResponse, null, 2));

      const response = await this.generateResponse(witResponse, userId);

      this.logMessage('bot', response, userId);
      return { response };
    } catch (error) {
      console.error('Error al procesar mensaje:', error);
      const errorResponse =
        'Lo siento, hubo un error al procesar tu mensaje. ¿Podrías intentarlo de nuevo?';
      this.logMessage('bot', errorResponse, userId);
      return errorResponse;
    }
  }

  private async generateResponse(witResponse: any, userId: string) {
    let respuestaTexto: string =
      'Lo siento, no entiendo tu pregunta, recuerda que sólo puedo darte los restaurantes que tengo registrados y el menu de cada uno de ellos';
    const intents = witResponse?.entities?.intent;

    if (!intents || intents.length === 0) {
      return respuestaTexto;
    }

    const intentName = intents[0].value;

    console.log('intentName');

    // Para los intents específicos de restaurante
    if (intentName === 'Saludo') {
      respuestaTexto =
        'Hola soy el asistente virtual de Rest0, puedo ayudarte a obtener los restaurantes registrados en nuestra plataforma y  ver su menu,considera que sólo puedo hacer una cosa a la vez, ¿En qué puedo ayudarte?';
    }

    if ((intentName === 'get_restaurants')) {
      const restaurants=await this.restaurantService.getRestaurantsQuery(1,5,4)
      const nombresString = restaurants.restaurants.map(rest => rest.name)
      if (nombresString.length > 0) {
        respuestaTexto = nombresString.join(', ')
      } else {
        respuestaTexto = nombresString[0];
      }
    }
    return respuestaTexto;
  }

  private logMessage(type: 'user' | 'bot', message: string, userId: string) {
    this.messageHistory.push({
      type,
      message,
      userId,
      timestamp: new Date(),
    });
  }

  async getChatHistory(userId: string) {
    return this.messageHistory.filter((msg) => msg.userId === userId);
  }
}

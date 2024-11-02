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
  private userStates: Record<string, { restaurantName?: string }> = {};
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

      const { response } = await this.generateResponse(
        witResponse,
        mensaje,
        userId,
      );
      console.log('response del back', response);

      this.logMessage('bot', response, userId);
      return response;
    } catch (error) {
      console.error('Error al procesar mensaje:', error);
      const errorResponse =
        'Lo siento, hubo un error al procesar tu mensaje. ¿Podrías intentarlo de nuevo?';
      this.logMessage('bot', errorResponse, userId);
      return { response: errorResponse }; // Asegúrate de devolver un objeto aquí
    }
  }

  private async generateResponse(
    witResponse: any,
    mensaje: string,
    userId: string,
  ) {
    let respuestaTexto: string =
      'Lo siento, no entiendo tu pregunta, recuerda que sólo puedo darte los restaurantes que tengo registrados y el menu de cada uno de ellos';
    const intents = witResponse?.entities?.intent;

    if (!intents || intents.length === 0) {
      return { response: respuestaTexto };
    }

    const intentName = intents[0].value;

    console.log('intentName');

    // Para los intents específicos de restaurante
    if (intentName === 'Saludo') {
      respuestaTexto =
        'Hola soy el asistente virtual de Rest0, puedo ayudarte a obtener los restaurantes registrados en nuestra plataforma y  ver su menu,considera que sólo puedo hacer una cosa a la vez, ¿En qué puedo ayudarte?';
    }

    if (intentName === 'get_restaurants') {
      const { restaurants } = await this.restaurantService.getRestaurantsQuery(
        1,
        5,
        4,
      );

      if (restaurants.length === 0) {
        respuestaTexto = 'No se encontraron restaurantes disponibles.';
      } else {
        const enumeratedRestaurants = restaurants
          .map((restaurant, index) => `${index + 1}. ${restaurant.name}`)
          .join('\n');

        respuestaTexto = `Aquí tienes la lista de restaurantes:\n${enumeratedRestaurants}`;
      }
    }

    if (intentName === 'get_menu_restaurant') {
      // Asegurarse de que se haya proporcionado un nombre de restaurante
      if (!this.userStates[userId]?.restaurantName) {
        respuestaTexto =
          'Por favor, dime el nombre del restaurante del cual deseas ver el menú.';
        this.userStates[userId] = { restaurantName: undefined }; // Inicializar el estado
      } else {
        const restaurantName = this.userStates[userId].restaurantName;
        const restaurant_menu =
          await this.restaurantService.getRestaurantByName(restaurantName);
        respuestaTexto = restaurant_menu?.menu
          ? `Aquí está el menú de ${restaurantName}:\n${restaurant_menu.menu.name}`
          : `No se encontró el menú de ${restaurantName}.`;
        delete this.userStates[userId]; // Limpiar el estado después de procesar la solicitud
      }
    }

    // Solo captura el nombre del restaurante si es un mensaje válido
    if (intents[0].value !== 'get_menu_restaurant' && mensaje) {
      const isValidRestaurantName =
        await this.checkIfValidRestaurantName(mensaje); // Función para validar el nombre
      if (isValidRestaurantName) {
        this.userStates[userId].restaurantName = mensaje; // Guardar el nombre del restaurante
        respuestaTexto = `Entendido, estás buscando el menú de ${mensaje}.`;
      }
    }
    return { response: respuestaTexto };
  }

  private async checkIfValidRestaurantName(name: string): Promise<boolean> {
    const { restaurants } = await this.restaurantService.getRestaurantsQuery(
      1,
      100,
      0,
    ); // Obtener una lista de restaurantes
    return restaurants.some((r) => r.name.toLowerCase() === name.toLowerCase());
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

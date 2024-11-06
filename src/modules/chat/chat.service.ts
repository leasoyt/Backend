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

  private userStates: Record<string, { restaurantName?: string; awaitingRestaurantName?: boolean }> = {};

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

      const generatedResponse = await this.generateResponse(witResponse, mensaje, userId);
      const response = generatedResponse?.response ?? 'Lo siento, hubo un error inesperado.';
      
      this.logMessage('bot', response, userId);
      return { response };
    } catch (error) {
      console.error('Error al procesar mensaje:', error);
      const errorResponse =
        'Lo siento, hubo un error al procesar tu mensaje. ¿Podrías intentarlo de nuevo?';
      this.logMessage('bot', errorResponse, userId);
      return { response: errorResponse };
    }
  }

  private async generateResponse(witResponse: any, mensaje: string, userId: string) {
    let respuestaTexto =
      'Lo siento, no entiendo tu pregunta. Solo puedo darte los restaurantes registrados y su menú.';
    const intents = witResponse?.entities?.intent;

    if (!intents || intents.length === 0) {
      const closestMatch = await this.findClosestRestaurantMatch(mensaje);
      if (closestMatch) {
        const restaurantMenu = await this.restaurantService.getRestaurantByName(closestMatch);
        respuestaTexto = restaurantMenu?.menu
          ? `Aquí está el menú de ${closestMatch}:\n${restaurantMenu.menu.name}`
          : `No se encontró el menú de ${closestMatch}.`;
        return { response: respuestaTexto };
      }
      return { response: respuestaTexto };
    }

    const intentName = intents[0].value;

    if (intentName === 'Saludo') {
      respuestaTexto = 'Hola, soy el asistente virtual de Rest0. ¿En qué puedo ayudarte?';
      return { response: respuestaTexto };
    }

    if (intentName === 'get_restaurants') {
      const { restaurants } = await this.restaurantService.getRestaurantsQuery(1, 10);
      if (restaurants.length === 0) {
        respuestaTexto = 'No se encontraron restaurantes disponibles.';
      } else {
        const enumeratedRestaurants = restaurants
          .map((restaurant, index) => `${index + 1}. ${restaurant.name} - Rating: ${restaurant.rating}`)
          .join('\n');
        respuestaTexto = `Aquí tienes la lista de mejores restaurantes:\n${enumeratedRestaurants}`;
      }
      return { response: respuestaTexto };
    }

    if (intentName === 'get_menu_name' && !this.userStates[userId]?.awaitingRestaurantName) {
      const { restaurants } = await this.restaurantService.getRestaurantsQuery(1, 10);
      if (restaurants.length) {
        const enumeratedRestaurants = restaurants
          .map((restaurant, index) => `${index + 1}. ${restaurant.name}`)
          .join('\n');
        respuestaTexto = `Dime el nombre del restaurante del cual deseas ver el menú. Elige alguno de esta lista:\n${enumeratedRestaurants}`;
        this.userStates[userId] = { awaitingRestaurantName: true };
      } else {
        respuestaTexto = 'No hay restaurantes disponibles.';
      }
      return { response: respuestaTexto };
    }

    if (intentName === 'get_restaurant_name' && this.userStates[userId]?.awaitingRestaurantName) {
      const closestMatch = await this.findClosestRestaurantMatch(mensaje);
      if (closestMatch) {
        this.userStates[userId].restaurantName = closestMatch;
        delete this.userStates[userId].awaitingRestaurantName;
        const restaurantMenu = await this.restaurantService.getRestaurantByName(closestMatch);
        respuestaTexto = restaurantMenu?.menu
          ? `Aquí está el menú de ${closestMatch}:\n${restaurantMenu.menu.name}`
          : `No se encontró el menú de ${closestMatch}.`;
      } else {
        const { restaurants } = await this.restaurantService.getRestaurantsQuery(1, 10);
        const enumeratedRestaurants = restaurants
          .map((restaurant, index) => `${index + 1}. ${restaurant.name}`)
          .join('\n');
        respuestaTexto = `El nombre "${mensaje}" no coincide con ningún restaurante registrado. Intenta con uno de esta lista:\n${enumeratedRestaurants}`;
      }
      return { response: respuestaTexto };
    }
  }

  private async findClosestRestaurantMatch(name: string): Promise<string | null> {
    const { restaurants } = await this.restaurantService.getRestaurantsQuery(1, 100, 0);
    let closestMatch: string | null = null;
    let highestSimilarity = 0;

    for (const restaurant of restaurants) {
      const similarity = this.calculateSimilarity(name.toLowerCase(), restaurant.name.toLowerCase());
      if (similarity > 0.8 && similarity > highestSimilarity) {
        highestSimilarity = similarity;
        closestMatch = restaurant.name;
      }
    }

    return closestMatch;
  }

  private calculateSimilarity(a: string, b: string): number {
    const distance = this.levenshteinDistance(a, b);
    const maxLength = Math.max(a.length, b.length);
    return maxLength === 0 ? 1 : 1 - distance / maxLength;
  }

  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = Array.from({ length: a.length + 1 }, () =>
      Array(b.length + 1).fill(0),
    );

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, 
          matrix[i][j - 1] + 1, 
          matrix[i - 1][j - 1] + cost, 
        );
      }
    }

    return matrix[a.length][b.length];
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

import { Injectable } from '@nestjs/common';
import { Wit } from 'node-wit'
import { config as dotenvConfig } from 'dotenv';
import { ChatProcessingService } from './chatProcessing.service';

dotenvConfig({ path: './env' });

@Injectable()
export class ChatService {
  constructor (private readonly chatProcessingService: ChatProcessingService){}
  private messages: { contenidoMensaje: string, idCliente: string, timestamp: Date }[] = [];

  saveMessage(contenidoMensaje: string, idCliente: string){
    const newMessage = {
      contenidoMensaje,
      idCliente,
      timestamp: new Date(),
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  getMessagesForUser(userId: string) {
    return this.messages.filter(msg => msg.idCliente === userId);
  }

  async createResponse(contenidoMensaje: string) {
    // this.saveMessage(contenidoMensaje, idCliente);
    const respuesta = await this.processingMessage(contenidoMensaje);
    return respuesta;
  }

  async processingMessage(mensaje:string) {
    const clientWit = new Wit({
      accessToken: process.env.WITTOKEN,
    });
    const respuesta = await clientWit.message(mensaje)
    let respuestaTexto;
    console.log(respuesta);
    const entities = respuesta?.entities;
    const intents = respuesta?.entities?.intent;
    if (!intents || intents.length === 0) {
      return 'Lo siento no puedo entenderte'
    }
    const intentName = intents[0].value;
    if (intentName === 'Saludo'){
      respuestaTexto = 'Hola soy el asistente virtual de Rest0, ¿En qué puedo ayudarte?'
    }
    else if(intentName === 'post_reservation') {
      respuestaTexto = this.chatProcessingService.createReservation(entities)
    }
    return respuestaTexto
  }
}

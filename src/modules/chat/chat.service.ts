import { Inject, Injectable } from '@nestjs/common';
import { Wit } from 'node-wit'
import { config as dotenvConfig } from 'dotenv';
import { ChatProcessingService } from './chatProcessing.service';

dotenvConfig({ path: './env' });

@Injectable()
export class ChatService {
  constructor (
    private readonly chatProcessingService: ChatProcessingService,
    @Inject('Wit') private readonly wit: Wit,
  ){}
  private messages: { idCliente: string, intent: string }[] = [];
  private confirmationReservation: { idClient: string, confirmationReservation: boolean}[] = [];

  saveMessage(idCliente: string, intent: string){
    const newMessage = {
      idCliente,
      intent
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  saveData(idCliente: string){
		const existingMessage = this.confirmationReservation.find(msg => msg.idClient === idCliente);
    if (existingMessage) {
      existingMessage.confirmationReservation = true
    } else {
      const confirmationRegister = { idClient: idCliente, confirmationReservation: false };
      this.confirmationReservation.push(confirmationRegister);
		}
	} 

  clearMessagesForClient(clientId: string) {
    this.messages = this.messages.filter(
      msg => msg.idCliente !== clientId
    );
  }

  clearConfirmationForClient(clientId: string) {
    this.confirmationReservation = this.confirmationReservation.filter(
      confirmation => confirmation.idClient !== clientId
    )
  }

  getMessagesForUser(userId: string) {
    return this.messages.filter(msg => msg.idCliente === userId);
  }

  getConfirmationReservationForUser(userId: string) {
    return this.confirmationReservation.find(msg => msg.idClient === userId);
  }

  async createResponse(contenidoMensaje: string, clientid: string) {
    const respuesta = await this.processingMessage(contenidoMensaje, clientid);
    return respuesta;
  }

  async processingMessage(mensaje:string, clientId: string) {
    const respuesta = await this.wit.message(mensaje)
    let respuestaTexto: string = 'Lo siento, no entiendo tu pregunta, recuerda que sólo puedo darte los restaurantes que tengo registrados y la ubicación de cada uno de ellos'
    console.log(respuesta)
    console.log(respuesta.entities.intent);
    const entities = respuesta?.entities;
    const intents = respuesta?.entities?.intent;
    
    if (!intents || intents.length === 0) {
      return respuestaTexto;
    }
    const intentName = intents[0].value;
    // this.saveMessage(clientId, intentName);
    // const respuestasAnteriores = this.getMessagesForUser(clientId);
    // if ( respuestasAnteriores.length > 2 && respuestasAnteriores.at(-1).intent === 'Saludo'){
    //   this.clearMessagesForClient(clientId);
    //   return respuestaTexto;
    // }
    // let existeConfirmacion = this.getConfirmationReservationForUser(clientId)
    // if(!existeConfirmacion) this.saveData(clientId)
    // existeConfirmacion = this.getConfirmationReservationForUser(clientId)
    // console.log(existeConfirmacion.confirmationReservation === true && (intentName !== 'confirmation' || intentName !== 'cancellation'))
    // if (existeConfirmacion.confirmationReservation === true && (intentName !== 'confirmation' && intentName !== 'cancellation')){
    //   return 'Por favor confirma o cancela tu reservación antes de continuar'
    // }
    // else if (existeConfirmacion.confirmationReservation === true && (intentName === 'confirmation' || intentName === 'cancellation')) {
    //   this.clearConfirmationForClient(clientId)
    //   if (intentName === 'confirmation') {
    //     return await this.chatProcessingService.crearReservation(clientId);
    //   }
    //   else if(intentName === 'cancellation'){
    //     return 'Creación de reservación cancelada, los datos se quedarán guardados hasta cierre la ventana del chat, para cambiar los datos proporciona nuevos valores para ellos. ¿Puedo ayudarlo con algo más?'
    //   }
    // }

    if (intentName === 'Saludo'){
      respuestaTexto = 'Hola soy el asistente virtual de Rest0, puedo ayudarte a obtener los restaurantes registrados en nuestra plataforma, obtener su ubicación y a agendar una reservación, considera que sólo puedo hacer una cosa a la vez, ¿En qué puedo ayudarte?'
    }
    // if(intentName === 'post_reservation') {
    //   // const existeConfirmacion = this.getConfirmationReservationForUser(clientId)
    //   const respuesta = await this.chatProcessingService.verificarDatosReservation(entities, clientId)
    //   if(respuesta.confirmationRequire === true) {
    //     this.saveData(clientId)
    //     respuestaTexto = 'Por favor confirme sus datos ' + respuesta.datos;
    //   } else {
    //     respuestaTexto = respuesta.mensaje
    //   }
    // }
    if (intentName === 'get_restaurants'){
      const respuesta = await this.chatProcessingService.getRestaurantsNames();
      respuestaTexto = respuesta
    }
    if (intentName === 'get_ubication_restaurant'){
      const respuesta = await this.chatProcessingService.getUbicationRestaurant(entities)
      respuestaTexto = respuesta;
    }

    return respuestaTexto
  }
}

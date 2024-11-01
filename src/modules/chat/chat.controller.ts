import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Post()
  // Le deje un id a cliente para poder identifcarlo en caso de que se hiciera una reservación, ahora que ya no se podrá no tiene función pero lo dejé para no tener que modificar el código
  async createResponse(@Body() mensaje: any){
    return await this.chatService.createResponse(mensaje.mensaje, mensaje.id)
  }
}

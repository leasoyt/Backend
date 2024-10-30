import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  // @Post()
  // async createResponse(@Body() mensaje: any){
  //   return await this.chatService.createResponse(mensaje.mensaje)
  // }
}

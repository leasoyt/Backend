import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Post()
  async createResponse(@Body() data: { message: string ,userId:string}) {

    const response = await this.chatService.processingMessage(data.message,data.userId);
    console.log('response',response);
    
    return response;
  }
}

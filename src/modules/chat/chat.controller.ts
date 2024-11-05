import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({
    summary: 'Permite iniciar una conversación con el chatbot'
  })
  @Post()
  async createResponse(@Body() data: { message: string ,userId:string}) {
    const response = await this.chatService.processingMessage(data.message,data.userId);
    return response;
  }
}

import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
// import { WebSocketGatewayChat } from './websocket.gateway';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { MenuModule } from '../menu/menu.module';

@Module({
  imports: [RestaurantModule, MenuModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}

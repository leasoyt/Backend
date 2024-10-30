import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { WebSocketGatewayChat } from './websocket.gateway';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { ChatProcessingService } from './chatProcessing.service';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports: [RestaurantModule, ReservationModule],
  controllers: [ChatController],
  providers: [ChatService, WebSocketGatewayChat, ChatProcessingService],
})
export class ChatModule {}

import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { ChatService } from "./chat.service";

@WebSocketGateway({ namespace: '/chat' })
export class WebSocketGatewayChat implements OnGatewayConnection, OnGatewayDisconnect {
    
    constructor(private readonly chatService: ChatService) {}

    @WebSocketServer()
    server: Server

    handleConnection(client: Socket) {
        console.log(`Cliente ${client.id} se conectó al chat`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Cliente ${client.id} se desconectó`);
    }

    @SubscribeMessage('message')
    async handleMessage(
        @MessageBody() data: string,
        @ConnectedSocket() client: Socket,
    ) {
        console.log(data)
        // const userId = client.handshake.headers['user'].id; // Suponiendo que el payload del token tiene 'id'
        const message = await this.chatService.createResponse(data);
        
        // Emitir el mensaje al destinatario si está conectado
        // client.emit(message)
        client.emit('mensajeServidor', message)
        // this.server.to(data.clientId).emit('message', message);
        return message;
    }

}
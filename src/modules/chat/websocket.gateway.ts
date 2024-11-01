import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { ChatService } from "./chat.service";

@WebSocketGateway({ namespace: '/chat' })
export class WebSocketGatewayChat implements OnGatewayConnection, OnGatewayDisconnect {
    
	constructor(private readonly chatService: ChatService) {}

	@WebSocketServer()
	server: Server

	handleConnection(client: Socket) {
			// client.emit('mensajesServidor', []);
	}

	handleDisconnect(client: Socket) {
		this.chatService.clearMessagesForClient(client.id)
			console.log(`Cliente ${client.id} se desconectó`);
	}

	@SubscribeMessage('message')
	async handleMessage(
			@MessageBody() data: string,
			@ConnectedSocket() client: Socket,
	) {
			try {
			const message = await this.chatService.createResponse(data, client.id);
			client.emit('mensajeServidor', message)
			return message;
			} catch (error) {
				throw error
			}
		}
}
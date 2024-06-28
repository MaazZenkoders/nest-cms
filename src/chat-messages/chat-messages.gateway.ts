import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessagesService } from './chat-messages.service';
import { CreateChatDto } from './dto/createchat-messagesdto';

@WebSocketGateway()
export class ChatMessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatMessagesService: ChatMessagesService) {}

    afterInit(server: Server) {
        this.server = server;
    }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('newMessage')
    async onNewMessage(@MessageBody() createChatDto: CreateChatDto) {
        const newMessage = await this.chatMessagesService.createChat(createChatDto);
        this.server.emit('onMessage', {
            msg: "New message",
            content: newMessage,
        });
    }
}

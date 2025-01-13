import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    return client.id;
  }

  async handleDisconnect(client: Socket) {
    return client.id;
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    data: {
      senderId: number;
      receiverId: number;
      content: string;
    },
  ) {
    try {
      const message = await this.chatService.saveMessage(
        data.senderId,
        data.receiverId,
        data.content,
      );
      this.server
        .to(data.receiverId.toString())
        .emit('receiveMessage', message);
      return message;
    } catch (error) {
      console.error('Error handling sendMessage:', error);
      throw new Error('Could not process message');
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, userId: number) {
    client.join(userId.toString());
    console.log(`User ${userId} joined room`);
  }
}

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessagesService } from './chat-messages.service';
import { CreateChatDto } from './dto/createchat-messagesdto';
import { ChatRoomService } from 'src/chats/chats.service';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chats } from 'src/chats/entities/chats';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { Repository } from 'typeorm';
import { Client } from 'socket.io/dist/client';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway()
export class ChatMessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatMessagesService: ChatMessagesService,

    private readonly authService: AuthService,

    private readonly chatRoomService: ChatRoomService,

    @InjectRepository(Chats)
    private readonly chatRepository: Repository<Chats>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private readonly teacherRepoistory: Repository<Teacher>,
  ) {}

  afterInit(server: Server) {
    this.server = server;
  }

  handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization?.split(' ')[1];
    if (!token) {
      client.disconnect();
      return;
    }
    this.authService.validateToken(token).then(
      (decoded) => {
        client['user'] = decoded;
        console.log(`Client connected: ${client.id}`);
      },
      (err) => {
        client.disconnect();
        console.log(`Client connected: ${client.id}`);
      }
    );
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    {
      teacher_id,
      student_id,
      room_id,
    }: { teacher_id: string; student_id: string; room_id: string },
  ) {
    try {
      const teacher = await this.teacherRepoistory.findOne({
        where: { email: teacher_id },
      });
      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }
      const student = await this.studentRepository.findOne({
        where: { email: student_id },
      });
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      const chat = await this.chatRepository.findOne({
        where: { teacher: teacher, student: student },
        relations: ['teacher', 'student'],
      });
      const room_id = chat.id;
      client.join(room_id);
      console.log(`Client ${client.id} joined room ${room_id}`);
    } catch (error) {
      console.error(`Error joining room `, error);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() createmessagedto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const message =
        await this.chatMessagesService.createChat(createmessagedto);
      client.to(createmessagedto.room_id).emit('message', {
        sentby: createmessagedto.senderEmail,
        text: message.content,
      });
    } catch (error) {
      console.log(error);
      console.log(client.id);
    }
  }
}

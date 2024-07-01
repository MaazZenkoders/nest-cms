import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessages } from './entities/chat-messages';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessagesGateway } from './chat-messages.gateway';
import { Chats } from 'src/chats/entities/chats';
import { ChatRoomService } from 'src/chats/chats.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessages, Student, Teacher, Chats])],
  providers: [ChatMessagesService, ChatMessagesGateway, ChatRoomService],
})
export class ChatMessagesModule {}

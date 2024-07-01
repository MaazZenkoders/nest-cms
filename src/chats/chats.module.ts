import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatRoomService } from './chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessages } from 'src/chat-messages/entities/chat-messages';
import { Chats } from './entities/chats';
import { Teacher } from 'src/teachers/entities/teacher';
import { Student } from 'src/students/entities/student';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessages, Chats, Teacher, Student])],
  controllers: [ChatsController],
  providers: [ChatRoomService],
})
export class ChatsModule {}

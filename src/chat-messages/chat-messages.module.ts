import { Module } from '@nestjs/common';
import { ChatMessagesController } from './chat-messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessages } from './entities/chat-messages';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessagesGateway } from './chat-messages.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessages, Student, Teacher])],
  providers: [ChatMessagesService, ChatMessagesGateway],
  controllers: [ChatMessagesController],
})
export class ChatMessagesModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessages } from './entities/chat-messages';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessagesGateway } from './chat-messages.gateway';
import { Chats } from 'src/chats/entities/chats';
import { ChatRoomService } from 'src/chats/chats.service';
import { AuthService } from 'src/auth/auth.service';
import { OtpService } from 'src/otp/otp.service';
import { DomainsService } from 'src/domains/domains.service';
import { Admin } from 'src/admins/entities/admin';
import { EmailsService } from 'src/emails/emails.service';
import { Otp } from 'src/otp/entities/otp';
import { Domain } from 'src/domains/entities/domain';
import { WsAuthMiddleware } from 'middlewares/wsauth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessages, Student, Teacher, Chats, Admin, Otp, Domain])],
  providers: [ChatMessagesService, ChatMessagesGateway, ChatRoomService, AuthService, OtpService, DomainsService, EmailsService, WsAuthMiddleware],
})
export class ChatMessagesModule {}

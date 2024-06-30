import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { CreateChatDto } from './dto/createchat-messagesdto';
import { ChatMessagesGateway } from './chat-messages.gateway';
import { RoleAuthorizationGuard } from 'src/guards/roleauthorization.guard';
import { Role } from 'src/decorators/roles.decorator';

@UseGuards(RoleAuthorizationGuard)
@Role('student', 'teacher')
@Controller('chats')
export class ChatMessagesController {
  constructor(
    private readonly chatMessagesService: ChatMessagesService,
    private readonly chatsGateway: ChatMessagesGateway,
  ) {}

  @Post('/create')
  async createChatMessage(@Body() createChatDto: CreateChatDto) {
    const newMessage = await this.chatMessagesService.createChat(createChatDto);
    this.chatsGateway.server.emit('onMessage', {
      msg: 'New message',
      content: newMessage,
    });
    return newMessage;
  }
}

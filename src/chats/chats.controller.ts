import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChatRoomService } from './chats.service';
import { CreateChatRoomDto } from './dto/createchat.dto';
import { RoleAuthorizationGuard } from 'src/guards/roleauthorization.guard';
import { Role } from 'src/decorators/roles.decorator';

// @UseGuards(RoleAuthorizationGuard)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  // @Role('student','teacher')
  @Post('/create')
  async createChatRoom(@Body() createchatroomdto: CreateChatRoomDto) {
    const chatRoom = await this.chatRoomService.createChat(createchatroomdto);
    return {
      status: HttpCode(HttpStatus.CREATED),
      chatRoom,
      message: 'Chat room created successfully.',
    };
  }
}

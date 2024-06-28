import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessages } from './entities/chat-messages';
import { CreateChatDto } from './dto/createchat-messagesdto';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';

@Injectable()
export class ChatMessagesService {
  constructor(
    @InjectRepository(ChatMessages)
    private readonly chatMessagesRepository: Repository<ChatMessages>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async createChat(createChatDto: CreateChatDto) {
    let sender, receiver;
    if (createChatDto.senderType === 'student') {
      sender = await this.studentRepository.findOne({
        where: { email: createChatDto.senderEmail },
      });
      if (!sender) {
        throw new BadRequestException('Student not found.');
      }
    } else {
      sender = await this.teacherRepository.findOne({
        where: { email: createChatDto.senderEmail },
      });
      if (!sender) {
        throw new BadRequestException('Teacher not found.');
      }
    }
    if (createChatDto.receiverType === 'student') {
      receiver = await this.studentRepository.findOne({
        where: { email: createChatDto.receiverEmail },
      });
      if (!receiver) {
        throw new BadRequestException('Student not found.');
      }
    } else {
      receiver = await this.teacherRepository.findOne({
        where: { email: createChatDto.receiverEmail },
      });
      if (!receiver) {
        throw new BadRequestException('Teacher not found.');
      }
    }
    const chat = this.chatMessagesRepository.create({
      content: createChatDto.content,
      senderStudent: createChatDto.senderType === 'student' ? sender : null,
      senderTeacher: createChatDto.senderType === 'teacher' ? sender : null,
      receiverStudent:
        createChatDto.receiverType === 'student' ? receiver : null,
      receiverTeacher:
        createChatDto.receiverType === 'teacher' ? receiver : null,
    });
    return this.chatMessagesRepository.save(chat);
  }
}

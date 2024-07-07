import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chats } from './entities/chats';
import { Repository } from 'typeorm';
import { Student } from 'src/students/entities/student';
import { Teacher } from 'src/teachers/entities/teacher';
import { CreateChatRoomDto } from './dto/createchat.dto';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(Chats)
    private readonly chatRepository: Repository<Chats>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private readonly teacherRepoistory: Repository<Teacher>,
  ) {}

  async createChat(createchatroomdto: CreateChatRoomDto) {
    console.log(createchatroomdto);
    const teacher = await this.teacherRepoistory.findOne({
      where: { email: createchatroomdto.teacher_id },
    });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    const student = await this.studentRepository.findOne({
      where: { email: createchatroomdto.student_id },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    const existingChat = await this.chatRepository.findOne({
      where: { teacher: teacher, student: student },
      relations: ['teacher', 'student'],
    });
    if (existingChat) {
      return existingChat.id;
    }
    const chatRoom = this.chatRepository.create({
      teacher: teacher,
      student: student,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await this.chatRepository.save(chatRoom);
    return {
      teacher: teacher.email,
      student: student.email,
    };
  }
}

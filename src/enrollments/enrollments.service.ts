import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Enrollment } from './entities/enrollments';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEnrollmentDto } from './dto/createenrollment.dto';
import { Student } from 'src/students/entities/student';
import { Course } from 'src/courses/entities/course';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(Student)
    private studentRepository: Repository<Student>,

    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async createEnrollment(createenrollmentdto: CreateEnrollmentDto) {
    const student = await this.studentRepository.findOne({
      where: { email: createenrollmentdto.student_id },
    });
    const course = await this.courseRepository.findOne({
      where: { course_code: createenrollmentdto.course_code },
    });
    if (!student || !course) {
      throw new BadRequestException('Cannot create enrollment');
    }
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: { student: student, course: course },
    });
    if (existingEnrollment) {
      throw new BadRequestException(
        'Student is already enrolled in this course',
      );
    }
    const enrollment = this.enrollmentRepository.create({
      enrollment_date: new Date(),
      updated_at: new Date(),
      student: student,
      course: course,
    });
    await this.enrollmentRepository.save(enrollment);
    return {
      student_id: student.email,
      course_code: course.course_code,
      date: enrollment.enrollment_date,
    };
  }

  async getEnrollmentsByStudentId(student_id: string) {
    const student = await this.studentRepository.findOne({
      where: { email: student_id },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    const enrollments = await this.enrollmentRepository.find({
      where: { student: student },
      relations: ['student', 'course'],
    });
    return enrollments;
  }

  async dropEnrollment(student_id: string, course_code: string) {
    const student = await this.studentRepository.findOne({
      where: { email: student_id },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    const course = await this.courseRepository.findOne({
      where: { course_code: course_code },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    const enrollment = await this.enrollmentRepository.findOne({
      where: { student: student, course: course },
      relations: ['course'],
    });
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    const currentDate = new Date();
    if (currentDate > course.deadline) {
      throw new ForbiddenException('Drop deadline has passed');
    }
    await this.enrollmentRepository.remove(enrollment);
    return { message: 'Course successfully dropped' };
  }
}

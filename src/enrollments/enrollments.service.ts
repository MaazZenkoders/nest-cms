import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    async createEnrollment (createenrollmentdto:CreateEnrollmentDto) {
        const student = await this.studentRepository.findOneBy({email:createenrollmentdto.student_id})
        const course = await this.courseRepository.findOneBy({course_code:createenrollmentdto.course_code})
        if (!student || !course ) {
            throw new BadRequestException("Cannot create enrollment")
        }
        const enrollment = new Enrollment();
        enrollment.enrollment_date = new Date(Date.now());
        enrollment.updated_at = new Date();
        enrollment.student = student;
        enrollment.course = course;
        await this.enrollmentRepository.save(enrollment);
        return enrollment
    }


  async getEnrollmentsByStudentId(studennt_id:string) {
    // const student = await this.studentRepository.findOne({ where: { email: student_id } });
    // if (!student) {
    //   throw new NotFoundException('Student not found');
    // }
    // const enrollments = await this.enrollmentRepository.find({
    //   where: { student: student },
    //   relations:['student','course']
    // });
    const enrollments = await this.enrollmentRepository
    .createQueryBuilder('enrollments')
    .innerJoinAndSelect('enrollments.student', 'students')
    .innerJoinAndSelect('enrollments.course', 'courses')
    .where('students.email = :student_id', { studennt_id })
    .getMany();
    if (enrollments.length === 0) {
      throw new NotFoundException('Enrollments not found for the given student email');
    }
    return enrollments
}
}

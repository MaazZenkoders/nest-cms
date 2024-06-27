import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from 'src/admins/dto/createadmin.dto';
import { Admin } from 'src/admins/entities/admin';
import { CreateStudentDto } from 'src/students/dto/createstudent.dto';
import { Student } from 'src/students/entities/student';
import { CreateTeacherDto } from 'src/teachers/dto/createteacher.dto';
import { Teacher } from 'src/teachers/entities/teacher';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginStudentDto } from 'src/students/dto/loginstudent.dto';
import { LoginTeacherDto } from 'src/teachers/dto/loginteacher.dto';
import { LoginAdminDto } from 'src/admins/dto/loginadmin.dto';
import * as FormData from 'form-data';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { OtpService } from 'src/otp/otp.service';
import { DomainsService } from 'src/domains/domains.service';
import { Domain } from 'src/domains/entities/domain';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    private readonly httpService: HttpService,

    private readonly otpService: OtpService,

    private readonly domainService: DomainsService,

    @InjectRepository(Student)
    private StudentRepository: Repository<Student>,

    @InjectRepository(Teacher)
    private TeacherRepository: Repository<Teacher>,

    @InjectRepository(Admin)
    private AdminRepository: Repository<Admin>,
  ) {}

  async studentSignup(createstudentdto: CreateStudentDto) {
    const existingUser = await this.StudentRepository.findOneBy({
      email: createstudentdto.email,
    });
    if (existingUser) {
      throw new HttpException(
        'Student with this email already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const userDomain = createstudentdto.email.split('@')[1];
    const domains: Domain[] = await this.domainService.getAllDomains();
    const domainNames = domains.map((domain) => domain.domain);
    const domainExists = domainNames.includes(userDomain);
    if (!domainExists) {
      throw new ForbiddenException(
        `Domain ${userDomain} is forbidden for this platform.`,
      );
    }
    this.otpService.generateOTP(createstudentdto.email);
    const hashedPassword = await bcrypt.hash(createstudentdto.password, 10);
    const user = this.StudentRepository.create({
      ...createstudentdto,
      password: hashedPassword,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    });
    this.StudentRepository.save(user);
    const payload = {
      email: createstudentdto.email,
      role: createstudentdto.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return { user, accessToken };
  }

  async teacherSignup(createteacherdto: CreateTeacherDto) {
    const existingUser = await this.TeacherRepository.findOneBy({
      email: createteacherdto.email,
    });
    if (existingUser) {
      throw new HttpException(
        'Teacher with this email already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const userDomain = createteacherdto.email.split('@')[1];
    const domains: Domain[] = await this.domainService.getAllDomains();
    const domainNames = domains.map((domain) => domain.domain);
    const domainExists = domainNames.includes(userDomain);
    if (!domainExists) {
      throw new ForbiddenException(
        `Domain ${userDomain} is forbidden for this platform.`,
      );
    }
    this.otpService.generateOTP(createteacherdto.email);
    const hashedPassword = await bcrypt.hash(createteacherdto.password, 10);
    const user = this.TeacherRepository.create({
      ...createteacherdto,
      password: hashedPassword,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    });
    this.TeacherRepository.save(user);
    const payload = {
      email: createteacherdto.email,
      role: createteacherdto.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return { user, accessToken };
  }

  async adminSignup(createadmindto: CreateAdminDto) {
    const existingUser = await this.AdminRepository.findOneBy({
      email: createadmindto.email,
    });
    if (existingUser) {
      throw new HttpException(
        'Admin with this email already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const userDomain = createadmindto.email.split('@')[1];
    const domains: Domain[] = await this.domainService.getAllDomains();
    const domainNames = domains.map((domain) => domain.domain);
    const domainExists = domainNames.includes(userDomain);
    if (!domainExists) {
      throw new ForbiddenException(
        `Domain ${userDomain} is forbidden for this platform.`,
      );
    }
    this.otpService.generateOTP(createadmindto.email);
    const hashedPassword = await bcrypt.hash(createadmindto.password, 10);
    const user = this.AdminRepository.create({
      ...createadmindto,
      password: hashedPassword,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    });
    this.AdminRepository.save(user);
    const payload = { email: createadmindto.email, role: createadmindto.role };
    const accessToken = await this.jwtService.signAsync(payload);
    return { user, accessToken };
  }

  async studentLogin(loginstudentdto: LoginStudentDto) {
    const user = await this.StudentRepository.findOneBy({
      email: loginstudentdto.email,
    });
    if (!user) {
      throw new HttpException(
        'Student with these credentials doesnt exist.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (user.is_suspended === true) {
      throw new ForbiddenException('You are suspended.');
    }
    const isPasswordValid = await bcrypt.compare(
      loginstudentdto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials.', HttpStatus.UNAUTHORIZED);
    }
    const payload = { email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    const loggedInUser = { email: user.email, password: user.password };
    return {
      loggedInUser,
      accessToken,
    };
  }

  async teacherLogin(loginteacherdto: LoginTeacherDto) {
    const user = await this.TeacherRepository.findOneBy({
      email: loginteacherdto.email,
    });
    if (!user) {
      throw new HttpException(
        'Teacher with these credentials doesnt exist.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (user.is_suspended === true) {
      throw new ForbiddenException('You are suspended.');
    }
    const isPasswordValid = await bcrypt.compare(
      loginteacherdto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials.', HttpStatus.UNAUTHORIZED);
    }
    const payload = { email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    const loggedInUser = { email: user.email, password: user.password };
    return {
      loggedInUser,
      accessToken,
    };
  }

  async adminLogin(loginadmindto: LoginAdminDto) {
    const user = await this.AdminRepository.findOneBy({
      email: loginadmindto.email,
    });
    if (!user) {
      throw new HttpException(
        'Admin with these credentials doesnt exist.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isPasswordValid = await bcrypt.compare(
      loginadmindto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials.', HttpStatus.UNAUTHORIZED);
    }
    const payload = { email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    const loggedInUser = { email: user.email, password: user.password };
    return {
      loggedInUser,
      accessToken,
    };
  }

  async uploadProfilePicture(file: Express.Multer.File) {
    let imageUrl: string;
    if (file) {
      const form = new FormData();
      form.append('image', file.buffer, file.originalname);
      const apiKey = '783d9d256253126161eb9f6b79c5a81e';
      const uploadUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;
      const response = await firstValueFrom(
        this.httpService.post(uploadUrl, form, {
          headers: {
            ...form.getHeaders(),
          },
        }),
      );
      imageUrl = response.data.data.url;
    }
    return imageUrl;
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from 'src/domains/entities/domain';
import * as formidable from 'formidable';

@Injectable()
export class EmailAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Domain)
    private readonly domainRepository: Repository<Domain>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const formData = await this.parseFormData(request);
      const email = formData['email'];
      if (!email) {
        throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
      }
      const emailDomain = email.split('@')[1];
      const whitelistedDomain = await this.domainRepository.findOne({
        where: { domain: emailDomain },
      });
      if (!whitelistedDomain) {
        throw new HttpException('Domain not allowed', HttpStatus.FORBIDDEN);
      }
      return true;
    } catch (error) {
      throw new HttpException('Invalid request data', HttpStatus.BAD_REQUEST);
    }
  }

  private async parseFormData(request: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.parse(request, (err: any, fields: unknown) => {
        if (err) {
          reject(err);
        } else {
          resolve(fields);
        }
      });
    });
  }
}

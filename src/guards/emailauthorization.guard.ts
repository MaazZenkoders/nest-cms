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
@Injectable()
export class EmailAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Domain)
    private readonly DomainRepository: Repository<Domain>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email } = request.body;
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }
    const emailDomain = email.split('@')[1];
    const whitelistedDomain = await this.DomainRepository.findOne({
      where: { domain: `@${emailDomain}` },
    });
    if (!whitelistedDomain) {
      throw new HttpException('Domain not allowed', HttpStatus.FORBIDDEN);
    }
    return true;
  }
}

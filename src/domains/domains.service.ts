import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDomainDto } from './dto/domain.dto';
import { Domain } from './entities/domain';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DomainsService {
  constructor(
    @InjectRepository(Domain)
    private DomainRepository: Repository<Domain>,
  ) {}

  async createDomain(createdomaindto: CreateDomainDto) {
    const existingDomain = await this.DomainRepository.findOneBy({
      domain: createdomaindto.domain,
    });
    if (existingDomain) {
      throw new HttpException(
        'This domain already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const domain = this.DomainRepository.create(createdomaindto);
    return domain;
  }
}

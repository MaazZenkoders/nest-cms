import {
  HttpException,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { CreateDomainDto } from './dto/domain.dto';
import { Domain } from './entities/domain';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleAuthorizationGuard } from 'src/guards/roleauthorization.guard';
import { Role } from 'src/decorators/roles.decorator';

@Injectable()
export class DomainsService {
  constructor(
    @InjectRepository(Domain)
    private DomainRepository: Repository<Domain>,
  ) {}

  @Role('admin')
  @UseGuards(RoleAuthorizationGuard)
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

  async getAllDomains() {
    const domains = await this.DomainRepository.find();
    return domains;
  }
}

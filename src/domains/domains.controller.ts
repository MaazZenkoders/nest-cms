import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { CreateDomainDto } from './dto/domain.dto';

@Controller('domains')
export class DomainsController {
    constructor(private readonly domainService: DomainsService) {}

    @Post('/create')
    async createDomain(@Body() createdomaindto:CreateDomainDto){
        const domain = await this.domainService.createDomain(createdomaindto)
        return{
            status:HttpCode(HttpStatus.CREATED),
            domain,
            message:"Domain successfully created"
        }
    }
}

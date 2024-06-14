import { Module } from '@nestjs/common';
import { DomainsController } from './domains.controller';
import { DomainsService } from './domains.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from 'domain';

@Module({
  imports: [TypeOrmModule.forFeature([Domain])],
  controllers: [DomainsController],
  providers: [DomainsService]
})
export class DomainsModule {}

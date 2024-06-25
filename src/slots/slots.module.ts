import { Module } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { SlotsController } from './slots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slots } from './entities/slots';
import { Teacher } from 'src/teachers/entities/teacher';

@Module({
  imports: [TypeOrmModule.forFeature([Slots, Teacher, Slots])],
  providers: [SlotsService],
  controllers: [SlotsController]
})
export class SlotsModule {}

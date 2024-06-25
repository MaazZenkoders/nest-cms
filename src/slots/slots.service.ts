import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slots } from './entities/slots';
import { Repository } from 'typeorm';
import { CreateSlotDto } from './dto/createslot.dto';
import { Teacher } from 'src/teachers/entities/teacher';
import { UpdateSlotDto } from './dto/updateslot.dto';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slots)
    private slotRepository: Repository<Slots>,

    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
  ) {}

  async createSlot(createslotdto: CreateSlotDto) {
    const teacher = await this.teacherRepository.findOne({
      where: { email: createslotdto.teacher_id },
    });
    if(!teacher){
        throw new NotFoundException('Teacher not found.')
    }
    const slot = this.slotRepository.create({
        ...createslotdto,
        teacher:teacher,
        })
    console.log(slot)
    await this.slotRepository.save(slot);
    return {
        teacher:teacher.email,
        slot_start: slot.slot_start,
        duration: slot.duration,
    }
  }

  async getSlotsByTeacherId(teacher_id: string) {
    const teacher = await this.teacherRepository.findOne({
        where: { email: teacher_id },
      });
      if(!teacher){
          throw new NotFoundException('Teacher not found.')
      }
      const teacherSlots = await this.slotRepository.find({
        where : {teacher: teacher},
        relations: ['teacher']
      })
      return teacherSlots;
  }

  async updateSlot(slot_id: number ,updateslotdto: UpdateSlotDto) {
    const slot = await this.slotRepository.findOneBy({slot_id});
      if(!slot){
          throw new NotFoundException('Slot not found.')
      }
      const updatedSlot = this.slotRepository.merge(slot, updateslotdto)
      await this.slotRepository.save(slot)
      return {
        id: updatedSlot.slot_id,
        slot_start: updatedSlot.slot_start,
        duration: updatedSlot.duration
      };
  }

  async deleteSlot(slot_id: number) {
    const slot = await this.slotRepository.findOneBy({slot_id});
      if(!slot){
          throw new NotFoundException('Slot not found.')
      }
      if(slot.available===false){
        throw new ForbiddenException('This slot is already reserved')
      }
      await this.slotRepository.remove(slot)
  }
}




import { PartialType } from '@nestjs/mapped-types';
import { CreateSlotDto } from './createslot.dto';

export class UpdateSlotDto extends PartialType(CreateSlotDto) {}

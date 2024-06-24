import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherDto } from './createteacher.dto';

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {}

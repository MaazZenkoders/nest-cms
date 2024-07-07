import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './createcourse.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}

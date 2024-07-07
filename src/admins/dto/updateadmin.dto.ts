import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './createadmin.dto';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}

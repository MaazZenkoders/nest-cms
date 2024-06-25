import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { CreateSlotDto } from './dto/createslot.dto';
import { UpdateSlotDto } from './dto/updateslot.dto';
import { RoleAuthorizationGuard } from 'src/guards/roleauthorization.guard';
import { Role } from 'src/decorators/roles.decorator';

@UseGuards(RoleAuthorizationGuard)
@Controller('slots')
export class SlotsController {
    constructor(
        private readonly slotService:SlotsService
    ) {}

    @Role('teacher')
    @Post('/create')
    async createSlot(@Body() createslotdto: CreateSlotDto) {
        const slot = await this.slotService.createSlot(createslotdto);
        return {
            status: HttpCode(HttpStatus.CREATED),
            slot,
            message: "Slot created successfully."
        }
    }

    @Role('student')
    @Get('/:teacher_id')
    async getSlotsByTeacherId(@Param('teacher_id') teacher_id: string) {
        const teacherSlots = await this.slotService.getSlotsByTeacherId(teacher_id);
        return {
            status: HttpCode(HttpStatus.OK),
            teacherSlots,
            message: "Slots of teacher retrieved successfully."
        }
    }

    @Role('teacher')
    @Patch('/:slot_id')
    async updateSlot(@Body() updateslotdto: UpdateSlotDto, @Param('slot_id') slot_id: number) {
        const updatedSlot = await this.slotService.updateSlot(slot_id, updateslotdto);
        return {
            status: HttpCode(HttpStatus.OK),
            updatedSlot,
            message: "Slot updated successfully."
        }
    }

    @Role('teacher')
    @Delete('/:slot_id')
    async deleteSlot( @Param('slot_id') slot_id: number) {
        await this.slotService.deleteSlot(slot_id);
        return {
            status: HttpCode(HttpStatus.OK),
            message: 'Slot deleted successfully.'
        }
    }
}

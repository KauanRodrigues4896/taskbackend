import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FindAllParameters, TaskDto } from './taskDto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() task: TaskDto) {
    this.taskService.create(task);
  }

  @Get('/:id')
  findById(@Param('id') id: string): Promise<TaskDto> {
    return this.taskService.findById(id);
  }

  @Get()
  findAll(@Query() params: FindAllParameters): Promise<TaskDto[]> {
    return this.taskService.findAll(params);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() task: TaskDto) {
    return this.taskService.update(id, task);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}

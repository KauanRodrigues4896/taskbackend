import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindAllParameters, TaskDto } from './taskDto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/db/entities/task.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  async create({
    title,
    description,
    expirationDate,
    status,
  }: TaskDto): Promise<TaskDto> {
    const taskToSave = this.taskRepository.create({
      title,
      description,
      expirationDate,
      status,
    });

    const createdTask = await this.taskRepository.save(taskToSave);
    return createdTask;
  }

  async findById(id: string): Promise<TaskDto> {
    const foundTask = await this.taskRepository.findOne({ where: { id } });

    if (!foundTask) {
      throw new HttpException(
        `Task with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return foundTask;
  }

  async findAll(params: FindAllParameters): Promise<TaskDto[]> {
    const searchPrams: FindOptionsWhere<TaskEntity> = {};

    if (params.title) {
      searchPrams.title = Like(`%${params.title}%`);
    }

    if (params.status) {
      searchPrams.status = Like(`%${params.status}%`);
    }

    const taskFound = await this.taskRepository.find({
      where: searchPrams,
    });

    return taskFound;
  }

  async update(
    id: string,
    { title, description, expirationDate, status }: TaskDto,
  ) {
    const foundTask = await this.taskRepository.preload({
      id,
      title,
      description,
      expirationDate,
      status,
    });

    if (!foundTask) {
      throw new HttpException(
        `Task with id ${id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.taskRepository.save(foundTask);
    return foundTask;
  }

  async remove(id: string) {
    const result = await this.taskRepository.delete(id);

    if (!result.affected) {
      throw new HttpException(
        `Task with id '${id}' not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // private mapEntityToDto(taskEntity, TaskEntity): Partial<TaskDto> {
  //   return {
  //     id: taskEntity.id,
  //     title: taskEntity.title,
  //     description: taskEntity.description,
  //     expirationDate: taskEntity.expirationDate,
  //     status: TaskStatusEnum[taskEntity.status],
  //   };
  // }
  // private mapDtoToEntity(taskDto: TaskDto): Partial<TaskEntity> {
  //   return {
  //     title: taskDto.title,
  //     description: taskDto.description,
  //     expirationDate: taskDto.expirationDate,
  //     status: taskDto.status.toString(),
  //   };
  // }
}

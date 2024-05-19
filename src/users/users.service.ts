import { ConflictException, Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { hashSync as bcryptHashSync } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create({ username, password }: UserDto) {
    const userAlredyRegistered = await this.usersRepository.findOne({
      where: { username },
    });

    if (userAlredyRegistered) {
      throw new ConflictException(`User '${username}' alredy registered`);
    }
    const passwordHash = bcryptHashSync(password, 10);

    const user = this.usersRepository.create({
      username: username,
      passwordHash: passwordHash,
    });

    const userCreated = await this.usersRepository.save(user);

    return userCreated;
  }

  async findByUserName(username: string): Promise<UserDto | null> {
    const userFound = await this.usersRepository.findOne({
      where: { username },
    });

    if (!userFound) {
      return null;
    }

    return {
      id: userFound.id,
      username: userFound.username,
      password: userFound.passwordHash,
    };
  }
}

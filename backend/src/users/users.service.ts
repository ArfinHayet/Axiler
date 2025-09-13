import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './repository/user.schema';
import { UsersRepository } from './repository/user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UsersRepository) {}

  // Create
  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepo.create(createUserDto);
  }

  // Find all
  async findAll(options?: object) {
    return this.userRepo.findAll(options);
  }

  // Find all with selected fields
  async findAllWithSelect(selectFields: string[], filter: object = {}): Promise<User[]> {
    return this.userRepo.findAllSelect(filter, selectFields);
  }

  // Find one by ID
  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  // Find one by filter with selected fields
  async findOneWithSelect(filter: object, selectFields: string[]): Promise<User> {
    const user = await this.userRepo.findOneSelect(filter, selectFields);
    return user;
  }

  // Update by ID
  async update(id: string, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    const updatedUser = await this.userRepo.update(id, updateUserDto);
    if (!updatedUser) throw new NotFoundException(`User with ID ${id} not found`);
    return updatedUser;
  }

  // Delete by ID
  async delete(id: string): Promise<{ message: string }> {
    const deletedUser = await this.userRepo.delete(id);
    if (!deletedUser) throw new NotFoundException(`User with ID ${id} not found`);
    return { message: `User with ID ${id} deleted successfully` };
  }
}

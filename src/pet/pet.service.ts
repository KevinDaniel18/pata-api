import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePetDto, UpdatePetDto } from './dto/pet.dto';

@Injectable()
export class PetService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.pet.findMany({
      where: { isAdopted: false }, // Only list pets that are not adopted
      include: { owner: true, requests: true },
    });
  }

  // Find a single pet by ID
  async findOne(id: number) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: { owner: true, requests: true },
    });
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found.`);
    }
    return pet;
  }

  // Create a new pet
  async create(createPetDto: CreatePetDto, userId: number) {
    try {
      const pet = await this.prisma.pet.create({
        data: { ...createPetDto, ownerId: userId },
      });
      console.log('pet created', { name: pet.name });
    } catch (error) {
      console.error('error creando pet', error);
    }
  }

  // Update an existing pet
  async update(id: number, updatePetDto: UpdatePetDto) {
    const pet = await this.prisma.pet.findUnique({ where: { id } });
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found.`);
    }
    return this.prisma.pet.update({
      where: { id },
      data: updatePetDto,
    });
  }

  async remove(id: number, newOwnerId: number) {
    const pet = await this.prisma.pet.findUnique({ where: { id } });
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found.`);
    }
    return this.prisma.pet.update({
      where: { id },
      data: {
        isAdopted: true,
        ownerId: newOwnerId,
      },
    });
  }
}

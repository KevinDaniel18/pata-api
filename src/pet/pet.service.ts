import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async adoptPet(id: number, newOwnerId: number) {
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

  async deleteAdoption(petId: number, userId: number) {
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet) {
      throw new NotFoundException(`Pet with ID ${petId} not found.`);
    }

    if (pet.ownerId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this adoption post.',
      );
    }

    return this.prisma.pet.delete({
      where: { id: petId },
    });
  }

  async likePet(petId: number, userId: number) {
    try {
      const existingLike = await this.prisma.petLike.findFirst({
        where: { petId, userId },
      });

      if (existingLike) {
        throw new Error('User already liked this comment.');
      }

      await this.prisma.petLike.create({
        data: { petId, userId },
      });

      const updatePet = await this.prisma.pet.update({
        where: { id: petId },
        data: { likes: { increment: 1 } },
      });

      return updatePet;
    } catch (error) {
      console.error(error);
    }
  }

  async unlikePet(petId: number, userId: number) {
    try {
      const existingLike = await this.prisma.petLike.findFirst({
        where: { petId, userId },
      });

      if (!existingLike) {
        throw new Error('User has not liked this comment.');
      }

      await this.prisma.petLike.delete({
        where: { id: existingLike.id },
      });

      const updatePet = await this.prisma.pet.update({
        where: { id: petId },
        data: { likes: { decrement: 1 } },
      });

      return updatePet;
    } catch (error) {
      throw new Error(error.message || 'Failed to unlike comment.');
    }
  }

  async hasUserLiked(petId: number, userId: number) {
    const like = await this.prisma.petLike.findFirst({
      where: { petId, userId },
    });
    return Boolean(like);
  }
}

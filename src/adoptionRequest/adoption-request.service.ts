import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAdoptionRequestDto } from './dto/create-adoption-request.dto';
import { RequestStatus } from '@prisma/client';

@Injectable()
export class AdoptionRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number) {
    const adoptionRequest = await this.prisma.adoptionRequest.findUnique({
      where: { id },
      include: {
        pet: {
          include: { owner: true },
        },
        user: true,
      },
    });
    if (!adoptionRequest) {
      throw new NotFoundException(`AdoptionRequest with ID ${id} not found.`);
    }
    return adoptionRequest;
  }

  async getPendingRequests(ownerId: number) {
    try {
      return await this.prisma.adoptionRequest.findMany({
        where: {
          status: RequestStatus.PENDING, // Solo solicitudes pendientes
          pet: {
            ownerId, // Filtrar por el dueño de la mascota
          },
        },
        include: {
          pet: {
            include: { owner: true },
          },
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener las solicitudes de adopción');
    }
  }

  async create(data: CreateAdoptionRequestDto) {
    try {
      return await this.prisma.adoptionRequest.create({
        data: {
          petId: data.petId,
          userId: data.userId,
          description: data.description,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updateStatus(id: number, status: RequestStatus) {
    try {
      const updatedRequest = await this.prisma.adoptionRequest.update({
        where: { id },
        data: { status },
      });
      return updatedRequest;
    } catch (error) {
      console.error(error);
      throw new Error('Error al actualizar el estado de la solicitud');
    }
  }
}

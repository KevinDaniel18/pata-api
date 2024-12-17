import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  NotFoundException,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AdoptionRequestService } from './adoption-request.service';
import { CreateAdoptionRequestDto } from './dto/create-adoption-request.dto';

@Controller('adoption-requests')
export class AdoptionRequestController {
  constructor(
    private readonly adoptionRequestService: AdoptionRequestService,
  ) {}

  // Obtener una solicitud de adopción por ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.adoptionRequestService.findOne(id);
  }

  @Get('pending/:userId')
  async getPendingRequests(@Param('userId') userId: number) {
    return await this.adoptionRequestService.getPendingRequests(Number(userId));
  }

  // Crear una nueva solicitud de adopción
  @Post()
  async create(@Body() createAdoptionRequestDto: CreateAdoptionRequestDto) {
    return await this.adoptionRequestService.create(createAdoptionRequestDto);
  }
}

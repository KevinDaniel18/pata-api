import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto, UpdatePetDto } from './dto/pet.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';

@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  // Get all pets
  @Get()
  async findAll() {
    return this.petService.findAll();
  }

  // Get a specific pet by ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.petService.findOne(id);
  }

  // Create a new pet
  @UseGuards(JwtAuthGuard)
  @Post('register')
  async create(@Body() createPetDto: CreatePetDto, @Request() req: any) {
    return this.petService.create(createPetDto, req.user.id);
  }

  // Update an existing pet
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    return this.petService.update(id, updatePetDto);
  }

  @Patch('setPetToAdopted/:id')
  async adoptPet(
    @Param('id', ParseIntPipe) id: number,
    @Body('newOwnerId', ParseIntPipe) newOwnerId: number,
  ) {
    return this.petService.adoptPet(Number(id), Number(newOwnerId));
  }
  @UseGuards(JwtAuthGuard)
  @Delete('deleteAdoptionPost/:id')
  async deletePet(
    @Param('id', ParseIntPipe) petId: number,
    @Request() req: any,
  ) {
    return this.petService.deleteAdoption(Number(petId), req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async likePet(@Param('id', ParseIntPipe) petId: number, @Request() req: any) {
    return this.petService.likePet(petId, req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/unlike')
  async unlikePet(@Param('id', ParseIntPipe) petId: number, @Request() req: any) {
    return this.petService.unlikePet(petId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/liked')
  async hasUserLiked(
    @Param('id', ParseIntPipe) petId: number,
    @Request() req: any,
  ) {
    return this.petService.hasUserLiked(petId, req.user.id);
  }
}

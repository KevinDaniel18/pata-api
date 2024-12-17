import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return await this.userService.userProfile(Number(id));
  }

  @Patch(':id/profile-picture')
  async updateProfilePicture(
    @Param('id') id: number,
    @Body('profilePicture') profilePicture: string,
  ) {
    return await this.userService.updateProfilePicture(
      Number(id),
      profilePicture,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteUser(@Request() req: any) {
    return this.userService.removeUserProfile(req.user.id);
  }
}

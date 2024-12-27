import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async userProfile(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: id },
        select: {
          name: true,
          city: true,
          country: true,
          email: true,
          profilePicture: true,
          pets: true,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async updateProfilePicture(id: number, profilePicture: string) {
    try {
      const updatePicture = await this.prisma.user.update({
        where: { id },
        data: { profilePicture },
      });
      return updatePicture;
    } catch (error) {
      console.error(error);
    }
  }

  async removeUserProfile(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || user.id !== userId) {
        throw new Error(
          'Unauthorized: You are not allowed to delete this account.',
        );
      }

      return this.prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      const { password, ...updateData } = updateUserDto;

      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : undefined;

      const data = {
        ...updateData,
        password: hashedPassword,
      };

      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async removeProfileImage(id: number) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { profilePicture: null },
      });
    } catch (error) {
      console.error(error);
    }
  }
}

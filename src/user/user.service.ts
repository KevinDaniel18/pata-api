import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async userProfile(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: id },
        select: {
          name: true,
          profilePicture: true,
          pets: true
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
}

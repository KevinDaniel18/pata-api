import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(senderId: number, receiverId: number, content: string) {
    try {
      return await this.prisma.message.create({
        data: { senderId, receiverId, content },
      });
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  }
  

  async getMessages(senderId: number, receiverId: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}

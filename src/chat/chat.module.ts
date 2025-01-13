import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from 'prisma/prisma.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from 'src/events/chat.gateway';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, PrismaService],
})
export class ChatModule {}

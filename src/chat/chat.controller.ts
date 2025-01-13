import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('messages')
  getMessages(@Request() req: any, @Query('receiverId') receiverId: number) {
    return this.chatService.getMessages(req.user.id, Number(receiverId));
  }
}

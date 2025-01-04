import {
  Controller,
  Post,
  UseGuards,
  Body,
  Request,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CommentsDto } from './dto/comments.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async addComments(@Body() commentDto: CommentsDto, @Request() req: any) {
    console.log('Cuerpo recibido:', commentDto);
    return this.commentsService.addComment(commentDto, req.user.id);
  }

  @Get(':id')
  async getCommentsByPet(@Param('id', ParseIntPipe) petId: number) {
    return this.commentsService.getCommentsByPet(petId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async likeComment(@Param('id', ParseIntPipe) commentId: number, @Request() req: any) {
    return this.commentsService.likeComment(commentId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unlike')
  async unlikeComment(@Param('id', ParseIntPipe) commentId: number, @Request() req: any) {
    return this.commentsService.unlikeComment(commentId, req.user.id);
  }


  @UseGuards(JwtAuthGuard)
  @Get(':id/liked')
  async hasUserLiked(
    @Param('id', ParseIntPipe) commentId: number,
    @Request() req: any,
  ) {
    return this.commentsService.hasUserLiked(commentId, req.user.id);
  }
}

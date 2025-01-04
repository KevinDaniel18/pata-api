import { PrismaService } from 'prisma/prisma.service';
import { CommentsDto } from './dto/comments.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}
  async addComment(commentDto: CommentsDto, userId: number) {
    try {
      const comment = await this.prisma.comment.create({
        data: { ...commentDto, userId },
        include: { user: true },
      });
      return comment;
    } catch (error) {
      console.error(error);
    }
  }

  async getCommentsByPet(petId: number) {
    try {
      const comments = await this.prisma.comment.findMany({
        where: { petId },
        include: { user: { include: { pets: true } } },
      });
      return comments;
    } catch (error) {
      console.error(error);
    }
  }

  async likeComment(commentId: number, userId: number) {
    try {
      const existingLike = await this.prisma.commentLike.findFirst({
        where: { commentId, userId },
      });

      if (existingLike) {
        throw new Error('User already liked this comment.');
      }

      await this.prisma.commentLike.create({
        data: { commentId, userId },
      });

      const updatedComment = await this.prisma.comment.update({
        where: { id: commentId },
        data: { likes: { increment: 1 } },
      });
      return updatedComment;
    } catch (error) {
      throw new Error(error.message || 'Failed to like comment.');
    }
  }

  async unlikeComment(commentId: number, userId: number) {
    try {
      const existingLike = await this.prisma.commentLike.findFirst({
        where: { commentId, userId },
      });

      if (!existingLike) {
        throw new Error('User has not liked this comment.');
      }

      await this.prisma.commentLike.delete({
        where: { id: existingLike.id },
      });

      const updatedComment = await this.prisma.comment.update({
        where: { id: commentId },
        data: { likes: { decrement: 1 } },
      });
      return updatedComment;
    } catch (error) {
      throw new Error(error.message || 'Failed to unlike comment.');
    }
  }

  async hasUserLiked(commentId: number, userId: number) {
    const like = await this.prisma.commentLike.findFirst({
      where: { commentId, userId },
    });
    return Boolean(like);
  }
}

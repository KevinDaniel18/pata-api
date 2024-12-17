import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationController } from './notifications.controller';

@Module({
  controllers: [NotificationController],
  providers: [NotificationsService, PrismaService],
  exports: [NotificationsService]
})
export class NotificationModule {}

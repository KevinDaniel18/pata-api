import { Controller, Patch, Body, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { UpdateNotificationTokenDto } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('updateNotificationToken')
  async updateNotificationToken(
    @Body() updateTokenDto: UpdateNotificationTokenDto,
    @Request() req: any,
  ) {
    const { expoPushToken } = updateTokenDto;

    if (!req.user.id || !expoPushToken) {
      throw new Error('userId and notificationToken are required');
    }

    return this.notificationService.updateNotificationToken(
      req.user.id,
      expoPushToken,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('disableNotifications')
  async disableNotifications(@Request() req: any) {
    if (!req.user.id) {
      throw new Error('userId is required');
    }

    return this.notificationService.removeNotificationToken(req.user.id);
  }
}

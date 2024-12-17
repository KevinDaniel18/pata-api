import { Module } from '@nestjs/common';
import { AdoptionRequestService } from './adoption-request.service';
import { AdoptionRequestGateway } from 'src/events/adoptions-request.gateway';
import { AdoptionRequestController } from './adoption-request.controller';
import { PrismaService } from 'prisma/prisma.service';
import { NotificationModule } from 'src/notifications/notifications.module';

@Module({
  imports: [NotificationModule],
  controllers: [AdoptionRequestController],
  providers: [AdoptionRequestService, AdoptionRequestGateway, PrismaService],
})
export class AdoptionRequestModule {}

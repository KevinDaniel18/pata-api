import { IsString } from 'class-validator';

export class UpdateNotificationTokenDto {
  @IsString()
  expoPushToken: string; 
}

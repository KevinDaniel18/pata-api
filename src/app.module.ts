import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PetModule } from './pet/pet.module';
import { UserModule } from './user/user.module';
import { AdoptionRequestModule } from './adoptionRequest/adoption-request.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [AuthModule, UserModule, PetModule, AdoptionRequestModule, CommentsModule],
})
export class AppModule {}

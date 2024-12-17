import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PetModule } from './pet/pet.module';
import { UserModule } from './user/user.module';
import { AdoptionRequestModule } from './adoptionRequest/adoption-request.module';

@Module({
  imports: [AuthModule, UserModule, PetModule, AdoptionRequestModule],
})
export class AppModule {}

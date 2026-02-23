import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [ConfigModule, ProfilesModule], // ProfilesModule si inyectas ProfilesService
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
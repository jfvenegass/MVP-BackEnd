// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PersonalTrackingModule } from './personalTracking/personalTracking.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Hace que se pueda usar en toda la app
    PersonalTrackingModule
  ],
})
export class AppModule {}
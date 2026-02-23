import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GameSessionsService } from './game-sessions.service';
import { GameSessionsController } from './game-sessions.controller';

@Module({
  imports: [
    ConfigModule, // necesario para usar ConfigService
  ],
  controllers: [GameSessionsController],
  providers: [GameSessionsService],
  exports: [GameSessionsService], // por si luego quieres usarlo en otro módulo (ej: orquestador)
})
export class GameSessionsModule {}
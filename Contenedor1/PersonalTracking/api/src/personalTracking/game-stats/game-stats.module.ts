// src/personalTracking/game-stats/game-stats.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GameStatsController } from './game-stats.controller';
import { GameStatsService } from './game-stats.service';

@Module({
  imports: [ConfigModule],
  controllers: [GameStatsController],
  providers: [GameStatsService],
  exports: [GameStatsService],
})
export class GameStatsModule {}
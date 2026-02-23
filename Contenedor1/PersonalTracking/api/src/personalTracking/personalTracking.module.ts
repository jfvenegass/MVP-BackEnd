// src/personalTracking/personalTracking.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PersonalTrackingController } from './personalTracking.controller';
import { PersonalTrackingService } from './personalTracking.service';
import { ProfilesModule } from './profiles/profiles.module';
import { StreaksModule } from './streaks/streaks.module';
import { AchievementsModule } from './achievements/achievements.module';
import { TitlesModule } from './titles/titles.module';
import { AuthModule } from './auth/auth.module';
import { GameSessionsModule } from './game-sessions/game-sessions.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // <- IMPORTANTE para este servidor
    AuthModule,
    ProfilesModule,
    StreaksModule,
    AchievementsModule,
    TitlesModule,
    GameSessionsModule
  ],
  controllers: [PersonalTrackingController],
  providers: [PersonalTrackingService],
})
export class PersonalTrackingModule {}
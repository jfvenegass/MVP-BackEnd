// src/personalTracking/achievements/dto/achievement-id.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AchievementIdDto {
  @ApiProperty({ description: 'ID del logro' })
  id: string;

  @ApiProperty({ description: 'Token de acceso del usuario' })
  accessToken: string;
}
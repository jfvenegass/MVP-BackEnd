// src/personalTracking/achievements/dto/achievement-id.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class AchievementIdDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  accessToken: string;
}
// src/personalTracking/achievements/dto/achievement-id.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class AchievementAllDto {

  @ApiProperty()
  accessToken: string;

}
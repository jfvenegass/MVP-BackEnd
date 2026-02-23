// src/personalTracking/achievements/dto/update-achievement.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class UpdateAchievementDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty({ required: false })
  nombre?: string;

  @ApiProperty({ required: false })
  descripcion?: string;

  @ApiProperty({ required: false })
  xpRequerido?: number;

  @ApiProperty({ required: false })
  icono?: string;

  @ApiProperty({ required: false })
  activo?: boolean;
}
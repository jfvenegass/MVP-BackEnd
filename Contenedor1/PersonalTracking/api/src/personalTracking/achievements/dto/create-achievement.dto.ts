// src/personalTracking/achievements/dto/create-achievement.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class CreateAchievementDto {
  @ApiProperty()
  nombre: string;

  @ApiProperty()
  descripcion: string;

  @ApiProperty()
  xpRequerido: number;

  @ApiProperty({ required: false })
  icono?: string;

  @ApiProperty({ default: true })
  activo: boolean;
}
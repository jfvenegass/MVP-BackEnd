// src/personalTracking/achievements/dto/update-achievement.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAchievementDto {
  @ApiProperty({ description: 'ID del logro a actualizar' })
  id: string;

  @ApiProperty({ description: 'Nombre del logro', required: false })
  nombre?: string;

  @ApiProperty({ description: 'Descripción del logro', required: false })
  descripcion?: string;

  @ApiProperty({ description: 'Icono del logro', required: false })
  icono?: string;

  @ApiProperty({ description: 'Puntos del logro', required: false })
  puntos?: number;

  @ApiProperty({ description: 'Si el logro es secreto', required: false })
  esSecreto?: boolean;
}
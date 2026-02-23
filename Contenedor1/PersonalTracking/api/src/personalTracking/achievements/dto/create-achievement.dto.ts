// src/personalTracking/achievements/dto/create-achievement.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateAchievementDto {
  @ApiProperty({ description: 'Nombre del logro' })
  nombre: string;

  @ApiProperty({ description: 'Descripción del logro' })
  descripcion: string;

  @ApiProperty({ description: 'Icono del logro', required: false })
  icono?: string;

  @ApiProperty({ description: 'Puntos del logro' })
  puntos: number;

  @ApiProperty({ description: 'Si el logro es secreto', default: false })
  esSecreto?: boolean;
}
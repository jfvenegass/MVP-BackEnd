import { ApiProperty } from '@nestjs/swagger';

export class AddExperienceDto {
  @ApiProperty({ description: 'ID del usuario' })
  usuarioId: string;

  @ApiProperty({ description: 'Access token de ROBLE' })
  accessToken: string;

  @ApiProperty({ description: 'Cantidad de experiencia a sumar', example: 50 })
  experiencia: number;
}
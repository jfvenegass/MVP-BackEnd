import { ApiProperty } from '@nestjs/swagger';

export class IncrementStatDto {
  @ApiProperty()
  usuarioId: string;

  @ApiProperty()
  juegoId: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  field: 'partidasJugadas' | 'victorias' | 'derrotas' | 'empates';

  @ApiProperty()
  value: number;
}
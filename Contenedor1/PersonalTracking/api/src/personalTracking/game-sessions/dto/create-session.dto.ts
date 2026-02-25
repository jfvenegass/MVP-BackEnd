import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty()
  usuarioId: string;

  @ApiProperty()
  juegoId: string;

  @ApiProperty()
  puntaje: number;

  @ApiProperty()
  resultado: string; // victoria | derrota | empate

  @ApiProperty()
  cambioElo: number;

  @ApiProperty()
  accessToken: string;
}
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEloDto {
  @ApiProperty()
  usuarioId: string;

  @ApiProperty()
  juegoId: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  eloChange: number;
}
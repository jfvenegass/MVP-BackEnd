import { ApiProperty } from '@nestjs/swagger';

export class ChangeLeagueDto {
  @ApiProperty()
  usuarioId: string;

  @ApiProperty()
  juegoId: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  nuevaLigaId: string;
}
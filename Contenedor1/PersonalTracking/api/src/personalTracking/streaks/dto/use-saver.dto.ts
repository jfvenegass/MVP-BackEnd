import { ApiProperty } from '@nestjs/swagger';

export class UseSaverDto {
  @ApiProperty()
  usuarioId: string;

  @ApiProperty()
  accessToken: string;
}
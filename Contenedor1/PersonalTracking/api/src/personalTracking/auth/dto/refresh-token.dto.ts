import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'jwt-refresh-token', description: 'Refresh token emitido por el login' })
  refreshToken: string;
}
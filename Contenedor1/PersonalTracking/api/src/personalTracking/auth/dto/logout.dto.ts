import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({ example: 'jwt-access-token', description: 'Access token del usuario' })
  accessToken: string;
}
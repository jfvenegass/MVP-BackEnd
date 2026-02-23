import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'usuario@correo.com', description: 'Correo del usuario' })
  email: string;

  @ApiProperty({ example: '12345678', description: 'Contraseña del usuario' })
  password: string;
}
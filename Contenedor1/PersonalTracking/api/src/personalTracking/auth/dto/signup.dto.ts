import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'usuario@correo.com', description: 'Correo del usuario' })
  email: string;

  @ApiProperty({ example: '12345678', description: 'Contraseña segura' })
  password: string;

  @ApiProperty({ example: 'Nombre Apellido', description: 'Nombre completo del usuario' })
  name: string;
}
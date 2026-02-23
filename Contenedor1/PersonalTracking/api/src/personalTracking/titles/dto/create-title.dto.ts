import { ApiProperty } from '@nestjs/swagger';

export class CreateTitleDto {
  @ApiProperty()
  nombre: string;
  
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  descripcion: string;

  @ApiProperty({ example: 'epico' })
  rareza: string;
}
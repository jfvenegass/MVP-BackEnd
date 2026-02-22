import { IsOptional, IsString } from 'class-validator';

export class UnirseTorneoDto {
  @IsOptional()
  @IsString()
  codigoAcceso?: string;
}

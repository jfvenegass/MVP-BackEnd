import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
} from 'class-validator';

export class CreateTorneoDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsBoolean()
  esPublico!: boolean;

  @IsOptional()
  @IsString()
  codigoAcceso?: string;

  @IsString()
  tipo!: string;

  @IsDateString()
  fechaInicio!: string;

  @IsDateString()
  fechaFin!: string;

  @IsOptional()
  @IsString()
  recurrencia?: string;

  @IsOptional()
  @IsObject()
  configuracion?: Record<string, unknown>;
}

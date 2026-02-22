import { IsEnum } from 'class-validator';
import { EstadoTorneo } from '../enums/estado-torneo.enum';

export class UpdateEstadoTorneoDto {
  @IsEnum(EstadoTorneo)
  estado!: EstadoTorneo;
}

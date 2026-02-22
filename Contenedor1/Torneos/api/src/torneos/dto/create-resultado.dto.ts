import { IsInt, Min } from 'class-validator';

export class CreateResultadoDto {
  @IsInt()
  @Min(0)
  puntaje!: number;

  @IsInt()
  @Min(0)
  tiempo!: number;
}

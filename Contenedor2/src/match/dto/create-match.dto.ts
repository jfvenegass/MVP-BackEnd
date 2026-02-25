import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty({ example: 'torneo-abc-123', description: 'ID del torneo PvP' })
  @IsString()
  @IsNotEmpty()
  torneoId: string;
}

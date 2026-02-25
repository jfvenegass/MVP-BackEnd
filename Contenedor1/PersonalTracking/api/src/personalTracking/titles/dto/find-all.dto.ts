import { ApiProperty } from '@nestjs/swagger';

export class TitleAllDto {
  @ApiProperty()
  accessToken: string;
}

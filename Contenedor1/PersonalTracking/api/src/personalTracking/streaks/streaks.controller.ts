import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StreaksService } from './streaks.service';
import { StreakActionDto } from './dto/streak-action.dto';
import { UseSaverDto } from './dto/use-saver.dto';
import { IncreaseSaversDto } from './dto/increase-savers.dto';

@ApiTags('streaks')
@Controller('streaks')
export class StreaksController {
  constructor(private readonly service: StreaksService) {}

  @Post('increase')
  @ApiOperation({ summary: 'Aumentar racha' })
  increase(@Body() dto: StreakActionDto) {
    return this.service.increaseStreak(dto.usuarioId, dto.accessToken);
  }

  @Post('reset')
  @ApiOperation({ summary: 'Resetear racha' })
  reset(@Body() dto: StreakActionDto) {
    return this.service.resetStreak(dto.usuarioId, dto.accessToken);
  }

  @Post('use-saver')
  @ApiOperation({ summary: 'Usar salvador de racha' })
  useSaver(@Body() dto: UseSaverDto) {
    return this.service.useSaver(dto.usuarioId, dto.accessToken);
  }

  @Post('increase-savers')
  @ApiOperation({ summary: 'Aumentar salvadores de racha' })
  increaseSavers(@Body() dto: IncreaseSaversDto) {
    return this.service.increaseSavers(
      dto.usuarioId,
      dto.cantidad,
      dto.accessToken,
    );
  }

  @Post('update-max')
  @ApiOperation({ summary: 'Actualizar racha máxima manualmente' })
  updateMax(@Body() dto: StreakActionDto) {
    return this.service.updateMaxStreak(dto.usuarioId, dto.accessToken);
  }
}
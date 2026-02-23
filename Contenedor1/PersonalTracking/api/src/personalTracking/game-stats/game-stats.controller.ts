import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GameStatsService } from './game-stats.service';
import { CreateGameStatDto } from './dto/create-game-stat.dto';
import { IncrementStatDto } from './dto/increment-stat.dto';
import { UpdateEloDto } from './dto/update-elo.dto';
import { ChangeLeagueDto } from './dto/change-league.dto';

@ApiTags('game-stats')
@Controller('game-stats')
export class GameStatsController {
  constructor(private readonly service: GameStatsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear estadísticas iniciales' })
  create(@Body() usuarioId: string, @Body() accessToken: string ) {
    return this.service.create(usuarioId,accessToken);
  }

  @Post('increment')
  @ApiOperation({ summary: 'Incrementar estadística específica' })
  increment(@Body() dto: IncrementStatDto) {
    return this.service.increment(dto);
  }

  @Post('elo')
  @ApiOperation({ summary: 'Actualizar ELO' })
  updateElo(@Body() dto: UpdateEloDto) {
    return this.service.updateElo(dto);
  }

  @Post('league')
  @ApiOperation({ summary: 'Cambiar liga' })
  changeLeague(@Body() dto: ChangeLeagueDto) {
    return this.service.changeLeague(dto);
  }
}
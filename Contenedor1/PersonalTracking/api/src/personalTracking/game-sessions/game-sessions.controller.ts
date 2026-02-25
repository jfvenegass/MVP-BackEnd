import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GameSessionsService } from './game-sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';

@ApiTags('game-sessions')
@Controller('game-sessions')
export class GameSessionsController {
  constructor(private readonly service: GameSessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear sesión de juego' })
  async create(@Body() dto: CreateSessionDto) {
    return this.service.create(dto);
  }
}
// src/personalTracking/achievements/achievements.controller.ts

import { Controller, Post, Body, Get, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { AchievementIdDto } from './dto/achievement-id.dto';
import { Achievement } from './interfaces/achievement.interface';

@ApiTags('achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly service: AchievementsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear logro' })
  @ApiResponse({ status: 201, type: Object })
  async create(
    @Body() dto: CreateAchievementDto,
    @Body('accessToken') accessToken: string,
  ): Promise<Achievement> {
    return this.service.create(dto, accessToken);
  }

  @Get()
  @ApiOperation({ summary: 'Listar logros' })
  async findAll(@Body('accessToken') accessToken: string) {
    return this.service.findAll(accessToken);
  }

  @Post('get')
  @ApiOperation({ summary: 'Obtener logro por ID' })
  async findOne(@Body() dto: AchievementIdDto) {
    return this.service.findOne(dto.id, dto.accessToken);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar logro' })
  async update(@Body() dto: UpdateAchievementDto) {
    return this.service.update(dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Eliminar logro' })
  async remove(@Body() dto: AchievementIdDto) {
    return this.service.remove(dto.id, dto.accessToken);
  }
}
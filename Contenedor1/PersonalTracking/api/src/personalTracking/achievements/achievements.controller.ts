// src/personalTracking/achievements/achievements.controller.ts

import { Controller, Post, Body, Get, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { AchievementIdDto } from './dto/achievement-id.dto';
import { Achievement } from './interfaces/achievement.interface';
import { AchievementAllDto } from './dto/achievement-all.dto';
import { UsuarioLogro } from './dto/usuario-logro.dto';
import { Usuario } from './dto/user.dto';

@ApiTags('achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly service: AchievementsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear logro' })
  @ApiResponse({ status: 201, type: Object })
  async create(
    @Body() dto: CreateAchievementDto,
  ): Promise<Achievement> {
    return this.service.create(dto);
  }
  
  @Post('getByUser')
  @ApiOperation({summary: 'Listar logros del usuario'})
  async findByUser(@Body() dto: Usuario) {
    return this.service.findUser(dto.usuarioId, dto.accessToken);
  }

  @Post('getAll')
  @ApiOperation({ summary: 'Listar logros' })
  async findAll(@Body() dto: AchievementAllDto) {
    return this.service.findAll(dto);
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


  @Post('add')
  @ApiOperation({ summary: 'Agregar logro a usuario' })
  async add(@Body() dto: UsuarioLogro) {
    return this.service.agregarLogro(dto.usuarioId,dto.logroId, dto.accessToken);
  }
  
  @Delete('unadd')
  @ApiOperation({ summary: 'Eliminar logro a usuario' })
  async unAdd(@Body() dto: UsuarioLogro) {
    return this.service.eliminarLogro(dto.usuarioId,dto.logroId, dto.accessToken);
  }

  @Delete()
  @ApiOperation({ summary: 'Eliminar logro' })
  async remove(@Body() dto: AchievementIdDto) {
    return this.service.remove(dto.id, dto.accessToken);
  }
}
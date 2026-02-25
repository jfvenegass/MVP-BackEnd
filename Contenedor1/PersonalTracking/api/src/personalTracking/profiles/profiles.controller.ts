// src/personalTracking/profiles/profiles.controller.ts
import { Controller, Post, Body, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { PerfilDto } from './dto/perfil.dto';
import { UsuarioIdDto } from './dto/usuarioId.dto';
import { AddExperienceDto } from './dto/addExperience.dto';

@ApiTags('profiles')
@ApiBearerAuth('access-token') // indica que requiere token
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un perfil para el usuario autenticado' })
  @ApiResponse({ status: 201, description: 'Perfil creado correctamente', type: CreateProfileDto })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
  async createProfile(@Body() createDto: CreateProfileDto, @Req() req: any) {
    const accessToken = req.cookies?.['accessToken'];
    const usuarioId = req.cookies?.['authExternoId'];

    if (!accessToken || !usuarioId) {
      throw new HttpException('Usuario no autenticado o cookies faltantes', HttpStatus.UNAUTHORIZED);
    }

    return this.profilesService.createProfile(createDto, accessToken, usuarioId);
  }

  @Post('me')
  @ApiOperation({ summary: 'Obtener perfil de un usuario dado su ID' })
  @ApiResponse({ status: 200, description: 'Perfil retornado correctamente', type: PerfilDto })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
  async getProfileById(@Body() body: UsuarioIdDto) {
    const { usuarioId, accessToken } = body;

    if (!usuarioId || !accessToken) {
      throw new HttpException('Faltan usuarioId o accessToken', HttpStatus.BAD_REQUEST);
    }

    return this.profilesService.getProfile(usuarioId, accessToken);
  }

  @Post('add-experience')
  @ApiOperation({ summary: 'Aumenta la experiencia actual del perfil de un usuario' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado correctamente', type: PerfilDto })
  @ApiResponse({ status: 400, description: 'Error al actualizar experiencia' })
  async addExperience(@Body() body: AddExperienceDto) {
    const { usuarioId, accessToken, experiencia } = body;

    if (!usuarioId || !accessToken || experiencia == null) {
      throw new HttpException('Faltan datos requeridos', HttpStatus.BAD_REQUEST);
    }

    // Obtenemos el perfil actual
    const perfil = await this.profilesService.getProfile(usuarioId, accessToken);
    if (!perfil) {
      throw new HttpException('Perfil no encontrado', HttpStatus.NOT_FOUND);
    }

    // Actualizamos la experiencia sumando el valor
    return this.profilesService.updateProfileExperience(
      usuarioId,
      perfil.experiencia + experiencia,
      accessToken,
    );
  }
}
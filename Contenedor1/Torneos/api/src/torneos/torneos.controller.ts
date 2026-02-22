import {
  Body,
  Post,
  Controller,
  Get,
  Req,
  UseGuards,
  Param,
  Patch,
  Put,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { RobleRequest } from '../common/types/roble-request';
import { RobleAuthGuard } from '../common/guards/roble-auth.guard';
import { TorneosService } from './torneos.service';
import { CreateTorneoDto } from './dto/create-torneo.dto';
import { UnirseTorneoDto } from './dto/unirse-torneo.dto';
import { getUserIdFromAccessToken } from '../common/utils/jwt.utils';
import { CreateResultadoDto } from './dto/create-resultado.dto';
import { UpdateEstadoTorneoDto } from './dto/update-estado-torneo.dto';
import { UpdateTorneoDto } from './dto/update-torneo.dto';

@ApiTags('Torneos')
@ApiBearerAuth('access-token')
@Controller('torneos')
@UseGuards(RobleAuthGuard)
export class TorneosController {
  constructor(private readonly service: TorneosService) {}

  private getUserId(req: RobleRequest): string {
    const userId = getUserIdFromAccessToken(req.accessToken);
    if (!userId) {
      throw new UnauthorizedException(
        'No se pudo determinar el ID del usuario desde el token',
      );
    }
    return userId;
  }

  @Get()
  async listar(@Req() req: RobleRequest) {
    return this.service.listarTorneos(req.accessToken);
  }

  @Get('usuarios/:usuarioId/resultados')
  async resultadosPorUsuario(
    @Req() req: RobleRequest,
    @Param('usuarioId') usuarioId: string,
  ) {
    return this.service.obtenerResultadosPorUsuario(req.accessToken, usuarioId);
  }

  @Get(':id')
  async obtener(@Req() req: RobleRequest, @Param('id') torneoId: string) {
    return this.service.obtenerTorneoDetalle(req.accessToken, torneoId);
  }

  @Patch(':id/estado')
  async cambiarEstado(
    @Req() req: RobleRequest,
    @Param('id') torneoId: string,
    @Body() dto: UpdateEstadoTorneoDto,
  ) {
    const usuarioId = this.getUserId(req);
    return this.service.actualizarEstadoTorneo(
      req.accessToken,
      torneoId,
      usuarioId,
      dto.estado,
    );
  }

  @Put(':id')
  async editar(
    @Req() req: RobleRequest,
    @Param('id') torneoId: string,
    @Body() dto: UpdateTorneoDto,
  ) {
    const usuarioId = this.getUserId(req);
    return this.service.editarTorneo(req.accessToken, torneoId, usuarioId, dto);
  }

  @Delete(':id')
  async cancelar(@Req() req: RobleRequest, @Param('id') torneoId: string) {
    const usuarioId = this.getUserId(req);
    return this.service.cancelarTorneo(req.accessToken, torneoId, usuarioId);
  }

  @Post()
  async crear(@Req() req: RobleRequest, @Body() dto: CreateTorneoDto) {
    const userId = this.getUserId(req);
    return this.service.crearTorneo(req.accessToken, userId, dto);
  }

  @Post(':id/unirse')
  async unirse(
    @Req() req: RobleRequest,
    @Param('id') torneoId: string,
    @Body() dto: UnirseTorneoDto,
  ) {
    const usuarioId = this.getUserId(req);
    return this.service.unirseATorneo(
      req.accessToken,
      torneoId,
      usuarioId,
      dto.codigoAcceso,
    );
  }

  @Get(':id/participantes')
  async participantes(@Req() req: RobleRequest, @Param('id') torneoId: string) {
    return this.service.listarParticipantes(req.accessToken, torneoId);
  }

  @Post(':id/resultados')
  registrarResultado(
    @Req() req: RobleRequest,
    @Param('id') torneoId: string,
    @Body() dto: CreateResultadoDto,
  ) {
    const usuarioId = this.getUserId(req);
    return this.service.registrarResultado(
      req.accessToken,
      torneoId,
      usuarioId,
      dto,
    );
  }

  @Get(':id/ranking')
  ranking(@Req() req: RobleRequest, @Param('id') torneoId: string) {
    return this.service.obtenerRanking(req.accessToken, torneoId);
  }
}

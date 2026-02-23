import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateGameStatDto } from './dto/create-game-stat.dto';
import { IncrementStatDto } from './dto/increment-stat.dto';
import { UpdateEloDto } from './dto/update-elo.dto';
import { ChangeLeagueDto } from './dto/change-league.dto';
import { GameStat } from './interfaces/game-stat.interface';

@Injectable()
export class GameStatsService {
  private readonly BASE_URL: string;
  private readonly dbName: string;

  constructor(private readonly configService: ConfigService) {
    this.dbName = this.configService.get<string>('ROBLE_DB_NAME') ?? '';
    this.BASE_URL = `https://roble-api.openlab.uninorte.edu.co/database/${this.dbName}`;
  }

    async create(usuarioId: string, accessToken: string): Promise<GameStat[]> {
    try {
        // 1️⃣ Obtener todos los juegos existentes
        const juegosResponse = await axios.get<any[]>(
        `${this.BASE_URL}/read`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { tableName: 'Juego' },
        },
        );

        const juegos = juegosResponse.data;

        if (!juegos.length) {
        throw new HttpException('No existen juegos registrados', HttpStatus.BAD_REQUEST);
        }

        // 2️⃣ Construir registros para cada juego
        const records = juegos.map((juego) => ({
        usuarioId,
        juegoId: juego.id || juego._id, // depende de cómo ROBLE devuelva el id
        elo: 1000,
        partidasJugadas: 0,
        victorias: 0,
        derrotas: 0,
        empates: 0,
        ligaId: null,
        }));

        // 3️⃣ Insertar todos en una sola operación
        const response = await axios.post<any>(
        `${this.BASE_URL}/insert`,
        {
            tableName: 'EstadisticasJuegoUsuario',
            records,
        },
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        },
        );

        return response.data.inserted;

    } catch (error: any) {
        throw new HttpException(
        error.response?.data || 'Error inicializando estadísticas',
        HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
    }

  private async getStat(usuarioId: string, juegoId: string, accessToken: string): Promise<GameStat> {
    const response = await axios.get<GameStat[]>(
      `${this.BASE_URL}/read`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { tableName: 'EstadisticasJuegoUsuario', usuarioId, juegoId },
      },
    );

    if (!response.data.length) {
      throw new HttpException('Estadística no encontrada', HttpStatus.NOT_FOUND);
    }

    return response.data[0];
  }

  async increment(dto: IncrementStatDto): Promise<GameStat | any> {
    const stat = await this.getStat(dto.usuarioId, dto.juegoId, dto.accessToken);

    const updatedValue = (stat[dto.field] as number) + dto.value;

    const response = await axios.put(
      `${this.BASE_URL}/update`,
      {
        tableName: 'EstadisticasJuegoUsuario',
        idColumn: '_id',
        idValue: stat._id,
        updates: {
          [dto.field]: updatedValue,
        },
      },
      { headers: { Authorization: `Bearer ${dto.accessToken}` } },
    );

    return response.data;
  }

  async updateElo(dto: UpdateEloDto): Promise<GameStat | any> {
    const stat = await this.getStat(dto.usuarioId, dto.juegoId, dto.accessToken);

    const newElo = stat.elo + dto.eloChange;

    const response = await axios.put(
      `${this.BASE_URL}/update`,
      {
        tableName: 'EstadisticasJuegoUsuario',
        idColumn: '_id',
        idValue: stat._id,
        updates: { elo: newElo },
      },
      { headers: { Authorization: `Bearer ${dto.accessToken}` } },
    );

    return response.data;
  }

  async changeLeague(dto: ChangeLeagueDto): Promise<GameStat | any> {
    const stat = await this.getStat(dto.usuarioId, dto.juegoId, dto.accessToken);

    const response = await axios.put(
      `${this.BASE_URL}/update`,
      {
        tableName: 'EstadisticasJuegoUsuario',
        idColumn: '_id',
        idValue: stat._id,
        updates: { ligaId: dto.nuevaLigaId },
      },
      { headers: { Authorization: `Bearer ${dto.accessToken}` } },
    );

    return response.data;
  }
}
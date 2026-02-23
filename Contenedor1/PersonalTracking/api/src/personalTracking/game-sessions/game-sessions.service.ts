import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class GameSessionsService {
  private readonly BASE_URL: string;
  private readonly dbName: string;

  constructor(private readonly configService: ConfigService) {
    this.dbName = this.configService.get<string>('ROBLE_DB_NAME') ?? '';
    this.BASE_URL = `https://roble-api.openlab.uninorte.edu.co/database/${this.dbName}`;
  }

  /**
   * Crea una nueva sesión de juego
   */
  async create(dto: CreateSessionDto) {
    const record = {
      usuarioId: dto.usuarioId,
      juegoId: dto.juegoId,
      puntaje: dto.puntaje,
      resultado: dto.resultado, // victoria | derrota | empate
      cambioElo: dto.cambioElo,
      jugadoEn: new Date(),
    };

    try {
      const response = await axios.post<any>(
        `${this.BASE_URL}/insert`,
        {
          tableName: 'SesionJuego',
          records: [record],
        },
        {
          headers: { Authorization: `Bearer ${dto.accessToken}` },
        },
      );

      if (response.data.inserted?.length > 0) {
        return response.data.inserted[0];
      }

      throw new HttpException(
        `No se pudo crear la sesión: ${JSON.stringify(response.data.skipped)}`,
        HttpStatus.BAD_REQUEST,
      );
    } catch (error: any) {
      if (error.response) {
        throw new HttpException(
          error.response.data || 'Error al crear sesión en ROBLE',
          error.response.status,
        );
      }

      throw new HttpException(
        'Error al conectar con ROBLE',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
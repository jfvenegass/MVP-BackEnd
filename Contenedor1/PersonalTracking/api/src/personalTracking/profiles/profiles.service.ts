// src/personalTracking/profiles/profiles.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Perfil } from './interfaces/perfil.interface';
import { InsertResponse } from './interfaces/roble-response.interface';

@Injectable()
export class ProfilesService {
  private readonly BASE_URL: string;
  private readonly dbName: string;

  constructor(private readonly configService: ConfigService) {
    this.dbName = this.configService.get<string>('ROBLE_DB_NAME') ?? '';
    this.BASE_URL = `https://roble-api.openlab.uninorte.edu.co/database/${this.dbName}`;
  }

  /** Normaliza los campos numéricos del perfil */
  private normalizarPerfil(perfil: any): Perfil {
    return {
      ...perfil,
      nivel: Number(perfil.nivel),
      experiencia: Number(perfil.experiencia),
      rachaActual: Number(perfil.rachaActual),
      rachaMaxima: Number(perfil.rachaMaxima),
      salvadoresRacha: Number(perfil.salvadoresRacha),
    };
  }

  /** Obtiene el perfil de un usuario por su ID */
  async getProfile(usuarioId: string, accessToken: string): Promise<Perfil | null> {
    try {
      const response = await axios.get<Perfil[]>(
        `${this.BASE_URL}/read`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { tableName: 'Perfil', usuarioId },
        },
      );

      if (response.data.length === 0) return null;
      return this.normalizarPerfil(response.data[0]);
    } catch (error: any) {
      throw new HttpException('Error al consultar perfil', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Crea un perfil nuevo para un usuario autenticado */
  async createProfile(createDto: CreateProfileDto, accessToken: string, usuarioId: string): Promise<Perfil> {
    const record = {
      usuarioId,
      nivel: createDto.nivel ?? 1,
      experiencia: createDto.experiencia ?? 0,
      rachaActual: createDto.rachaActual ?? 0,
      rachaMaxima: createDto.rachaMaxima ?? 0,
      salvadoresRacha: createDto.salvadoresRacha ?? 0,
    };

    try {
      const response = await axios.post<InsertResponse<Perfil>>(
        `${this.BASE_URL}/insert`,
        { tableName: 'Perfil', records: [record] },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (response.data.inserted.length > 0) {
        return this.normalizarPerfil(response.data.inserted[0]);
      }

      throw new HttpException(
        `No se pudo crear el perfil: ${JSON.stringify(response.data.skipped)}`,
        HttpStatus.BAD_REQUEST,
      );
    } catch (error: any) {
      if (error.response) {
        throw new HttpException(
          error.response.data || 'Error al crear perfil en ROBLE',
          error.response.status,
        );
      }
      throw new HttpException('Error al conectar con ROBLE', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Calcula el XP necesario para subir del nivel actual */
  private xpParaSiguienteNivel(nivel: number): number {
    if (nivel >= 1 && nivel <= 10) return nivel * 100;
    if (nivel >= 11 && nivel <= 30) return nivel * 150;
    if (nivel >= 31 && nivel <= 50) return nivel * 250;
    return nivel + 250; // nivel 50+
  }

  /** Actualiza la experiencia y maneja subida de nivel */
  async updateProfileExperience(
    usuarioId: string,
    experienciaGanada: number,
    accessToken: string
  ): Promise<Perfil> {
    // Primero obtenemos el perfil actual
    const perfil = await this.getProfile(usuarioId, accessToken);
    if (!perfil) {
      throw new HttpException('Perfil no encontrado', HttpStatus.NOT_FOUND);
    }

    // Normalizamos los valores numéricos
    let nivel = Number(perfil.nivel);
    let experiencia = Number(perfil.experiencia);
    let rachaActual = Number(perfil.rachaActual);
    let rachaMaxima = Number(perfil.rachaMaxima);
    let salvadoresRacha = Number(perfil.salvadoresRacha);

    // Sumamos la experiencia ganada
    
    console.log(experiencia + "+" + experienciaGanada +"=" + (experiencia += experienciaGanada));

    // Subimos de nivel mientras la experiencia supere el tope del nivel actual
    while (experienciaGanada >= this.xpParaSiguienteNivel(nivel)) {
      experienciaGanada -= this.xpParaSiguienteNivel(nivel);
      nivel += 1;
    }

    try {
      // Actualizamos el perfil en ROBLE
      const response = await axios.put<Perfil>(
        `${this.BASE_URL}/update`,
        {
          tableName: 'Perfil',
          idColumn: 'usuarioId',
          idValue: usuarioId,
          updates: {
            nivel,
            experiencia: experienciaGanada,
            rachaActual,
            rachaMaxima,
            salvadoresRacha,
          },
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      // Normalizamos la respuesta antes de retornarla
      return {
        ...response.data,
        nivel: Number(response.data.nivel),
        experiencia: Number(response.data.experiencia),
        rachaActual: Number(response.data.rachaActual),
        rachaMaxima: Number(response.data.rachaMaxima),
        salvadoresRacha: Number(response.data.salvadoresRacha),
      };
    } catch (error: any) {
      if (error.response) {
        throw new HttpException(
          error.response.data || 'Error al actualizar experiencia en ROBLE',
          error.response.status,
        );
      }
      throw new HttpException('Error al conectar con ROBLE', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
// src/personalTracking/achievements/achievements.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { Achievement } from './interfaces/achievement.interface';
import { RobleInsertResponse } from '../../common/interfaces/roble-response.interface';

@Injectable()
export class AchievementsService {
  private readonly BASE_URL: string;
  private readonly dbName: string;

  constructor(private readonly configService: ConfigService) {
    this.dbName = this.configService.get<string>('ROBLE_DB_NAME') ?? '';
    this.BASE_URL = `https://roble-api.openlab.uninorte.edu.co/database/${this.dbName}`;
  }

  async create(
    dto: CreateAchievementDto,
    accessToken: string,
  ): Promise<Achievement> {
    try {
      const response = await axios.post<RobleInsertResponse<Achievement>>(
        `${this.BASE_URL}/insert`,
        {
          tableName: 'Logro',
          records: [dto],
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (response.data.inserted.length > 0) {
        return response.data.inserted[0];
      }

      throw new HttpException(
        'No se pudo crear el logro',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || 'Error al crear logro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(accessToken: string): Promise<Achievement[]> {
    try {
      const response = await axios.get<Achievement[]>(
        `${this.BASE_URL}/read`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { tableName: 'Logro' },
        },
      );

      return response.data;
    } catch {
      throw new HttpException(
        'Error al listar logros',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(
    id: string,
    accessToken: string,
  ): Promise<Achievement | null> {
    try {
      const response = await axios.get<Achievement[]>(
        `${this.BASE_URL}/read`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { tableName: 'Logro', _id: id },
        },
      );

      return response.data.length > 0 ? response.data[0] : null;
    } catch {
      throw new HttpException(
        'Error al obtener logro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    dto: UpdateAchievementDto,
  ): Promise<Achievement> {
    const { id, accessToken, ...updates } = dto;

    try {
      const response = await axios.put<Achievement>(
        `${this.BASE_URL}/update`,
        {
          tableName: 'Logro',
          idColumn: '_id',
          idValue: id,
          updates,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return response.data;
    } catch {
      throw new HttpException(
        'Error al actualizar logro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(
    id: string,
    accessToken: string,
  ): Promise<Achievement> {
    try {
      const response = await axios.request<Achievement | any >({
        method: 'DELETE',
        url: `${this.BASE_URL}/delete`,
        headers: { Authorization: `Bearer ${accessToken}` },
        data: {
          tableName: 'Logro',
          idColumn: '_id',
          idValue: id,
        },
      });

      return response.data;
    } catch {
      throw new HttpException(
        'Error al eliminar logro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
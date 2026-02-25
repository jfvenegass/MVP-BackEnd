import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateTitleDto } from './dto/create-title.dto';
import { UpdateTitleDto } from './dto/update-title.dto';
import { Title } from './interfaces/title.interface';

interface RobleInsertResponse<T> {
  inserted: T[];
  skipped: any[];
}

@Injectable()
export class TitlesService {
  private readonly BASE_URL: string;
  private readonly dbName: string;

  constructor(private readonly configService: ConfigService) {
    this.dbName = this.configService.get<string>('ROBLE_DB_NAME') ?? '';
    this.BASE_URL = `https://roble-api.openlab.uninorte.edu.co/database/${this.dbName}`;
  }

  async create(dto: CreateTitleDto, accessToken: string): Promise<Title> {
    const record = {
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      rareza: dto.rareza
    }
    try {
      const response = await axios.post(
        `${this.BASE_URL}/insert`,
        {
          tableName: 'Titulo',
          records: [record],
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const data = response.data as RobleInsertResponse<Title>;

      if (data.inserted.length > 0) {
        return data.inserted[0];
      }

      throw new HttpException(
        `No se pudo crear el título`,
        HttpStatus.BAD_REQUEST,
      );
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || 'Error al crear título',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(accessToken: string): Promise<Title[]> {
    try {
      const response = await axios.get(`${this.BASE_URL}/read`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { tableName: 'Titulo' },
      });

      return response.data as Title[];
    } catch {
      throw new HttpException('Error al listar títulos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string, accessToken: string): Promise<Title | null> {
    try {
      const response = await axios.get(`${this.BASE_URL}/read`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { tableName: 'Titulo', _id: id },
      });

      const data = response.data as Title[];
      return data.length > 0 ? data[0] : null;
    } catch {
      throw new HttpException('Error al obtener título', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(dto: UpdateTitleDto): Promise<Title> {
    try {
      const { id, accessToken, ...updates } = dto;

      const response = await axios.put(
        `${this.BASE_URL}/update`,
        {
          tableName: 'Titulo',
          idColumn: '_id',
          idValue: id,
          updates,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return response.data as Title;
    } catch {
      throw new HttpException('Error al actualizar título', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: string, accessToken: string): Promise<Title> {
    try {
      const response = await axios.request({
        method: 'DELETE',
        url: `${this.BASE_URL}/delete`,
        headers: { Authorization: `Bearer ${accessToken}` },
        data: {
          tableName: 'Titulo',
          idColumn: '_id',
          idValue: id,
        } as any,
      });

      return response.data as Title;
    } catch {
      throw new HttpException('Error al eliminar título', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
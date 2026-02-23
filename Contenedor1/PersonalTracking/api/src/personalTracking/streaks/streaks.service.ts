import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class StreaksService {
  private readonly BASE_URL = process.env.DB_SERVICE_URL;

  // ================================
  // AUMENTAR RACHA
  // ================================
  async increaseStreak(usuarioId: string, accessToken: string) {
    try {
      const perfil = await this.getProfile(usuarioId, accessToken);

      const nuevaRacha = perfil.rachaActual + 1;

      const nuevaRachaMaxima =
        nuevaRacha > perfil.rachaMaxima
          ? nuevaRacha
          : perfil.rachaMaxima;

      await this.updateProfile(
        perfil.id,
        {
          rachaActual: nuevaRacha,
          rachaMaxima: nuevaRachaMaxima,
        },
        accessToken,
      );

      return {
        message: 'Racha aumentada correctamente',
        rachaActual: nuevaRacha,
        rachaMaxima: nuevaRachaMaxima,
      };
    } catch {
      throw new HttpException(
        'Error aumentando racha',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ================================
  // RESETEAR RACHA
  // ================================
  async resetStreak(usuarioId: string, accessToken: string) {
    try {
      const perfil = await this.getProfile(usuarioId, accessToken);

      await this.updateProfile(
        perfil.id,
        { rachaActual: 0 },
        accessToken,
      );

      return { message: 'Racha reseteada correctamente' };
    } catch {
      throw new HttpException(
        'Error reseteando racha',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ================================
  //  USAR SALVADOR
  // ================================
  async useSaver(usuarioId: string, accessToken: string) {
    try {
      const perfil = await this.getProfile(usuarioId, accessToken);

      if (perfil.salvadoresRacha <= 0) {
        throw new HttpException(
          'No hay salvadores disponibles',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.updateProfile(
        perfil.id,
        {
          salvadoresRacha: perfil.salvadoresRacha - 1,
        },
        accessToken,
      );

      return { message: 'Salvador utilizado correctamente' };
    } catch (error) {
      throw error;
    }
  }

  // ================================
  //  AUMENTAR SALVADORES
  // ================================
  async increaseSavers(
    usuarioId: string,
    cantidad: number,
    accessToken: string,
  ) {
    try {
      const perfil = await this.getProfile(usuarioId, accessToken);

      await this.updateProfile(
        perfil.id,
        {
          salvadoresRacha: perfil.salvadoresRacha + cantidad,
        },
        accessToken,
      );

      return { message: 'Salvadores aumentados correctamente' };
    } catch {
      throw new HttpException(
        'Error aumentando salvadores',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ================================
  //  ACTUALIZAR RACHA MAXIMA
  // ================================
  async updateMaxStreak(usuarioId: string, accessToken: string) {
    try {
      const perfil = await this.getProfile(usuarioId, accessToken);

      if (perfil.rachaActual > perfil.rachaMaxima) {
        await this.updateProfile(
          perfil.id,
          { rachaMaxima: perfil.rachaActual },
          accessToken,
        );
      }

      return { message: 'Racha máxima validada' };
    } catch {
      throw new HttpException(
        'Error actualizando racha máxima',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ================================
  //  HELPERS PRIVADOS
  // ================================
  private async getProfile(usuarioId: string, accessToken: string) {
    const response = await axios.post<any>(
      `${this.BASE_URL}/find`,
      {
        tableName: 'Perfil',
        where: { usuarioId },
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    return response.data[0];
  }

  private async updateProfile(
    id: string,
    data: any,
    accessToken: string,
  ) {
    await axios.post(
      `${this.BASE_URL}/update`,
      {
        tableName: 'Perfil',
        where: { id },
        data,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  }
}
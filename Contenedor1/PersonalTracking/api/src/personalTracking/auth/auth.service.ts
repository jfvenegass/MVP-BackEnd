// src/personalTracking/auth/auth.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { SignupDto } from './dto/signup.dto';
import { AuthResponse } from './interfaces/auth-response.interface';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class AuthService {
  private readonly BASE_URL = 'https://roble-api.openlab.uninorte.edu.co/auth';
  private readonly dbName: string;

  constructor(private readonly configService: ConfigService, 
    private readonly ProfilesService: ProfilesService,) {
    this.dbName = this.configService.get<string>('ROBLE_DB_NAME') ?? "";
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    let loginData: AuthResponse;

    try {
      const response = await axios.post<AuthResponse>(
        `${this.BASE_URL}/${this.dbName}/login`,
        { email, password },
      );
      loginData = response.data;
    } catch (error: any) {
      if (error.response) {
        throw new HttpException(
          error.response.data || 'Error de autenticación',
          error.response.status,
        );
      }
      throw new HttpException('Error al conectar con ROBLE', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Verificar o crear perfil automáticamente usando user.id
    await this._ensureProfile(loginData.accessToken, loginData.user.id);

    return loginData;
  }

  private async _ensureProfile(accessToken: string, authExternoId: string) {
    try {
      const existingProfile = await this.ProfilesService.getProfile(authExternoId, accessToken);

      if (!existingProfile) {
        await this.ProfilesService.createProfile({}, accessToken, authExternoId);
      }
    } catch (err) {
      console.error('Error verificando o creando perfil:', err);
      // No lanzamos error para que el login siga funcionando
    }
  }


  async refreshToken(refreshDto: RefreshTokenDto) {
    const { refreshToken } = refreshDto;
    try {
      const response = await axios.post<{ accessToken: string }>(
        `${this.BASE_URL}/${this.dbName}/refresh-token`,
        { refreshToken },
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new HttpException(
          error.response.data || 'Error al refrescar token',
          error.response.status,
        );
      }
      throw new HttpException('Error al conectar con ROBLE', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async logout(logoutDto: LogoutDto) {
    const { accessToken } = logoutDto;
    try {
      await axios.post(
        `${this.BASE_URL}/${this.dbName}/logout`,
        null,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      return { message: 'Logout exitoso' };
    } catch (error: any) {
      if (error.response) {
        throw new HttpException(
          error.response.data || 'Error al hacer logout',
          error.response.status,
        );
      }
      throw new HttpException('Error al conectar con ROBLE', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signup(signupDto: SignupDto) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/${this.dbName}/signup`,
        signupDto,
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new HttpException(
          error.response.data || 'Error en el signup',
          error.response.status,
        );
      }
      throw new HttpException('Error al conectar con ROBLE', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signupDirect(signupDto: SignupDto) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/${this.dbName}/signup-direct`,
        signupDto,
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new HttpException(
          error.response.data || 'Error en el signup-direct',
          error.response.status,
        );
      }
      throw new HttpException('Error al conectar con ROBLE', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import {
  RobleLoginResponse,
  RobleRefreshResponse,
  RobleVerifyTokenResponse,
  RobleGenericSuccess,
} from './interfaces/roble-auth-response.interface';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    const base = this.config.getOrThrow<string>('ROBLE_AUTH_BASE');
    const db = this.config.getOrThrow<string>('ROBLE_DBNAME');
    this.baseUrl = `${base}/${db}`;
  }

  async login(dto: LoginDto): Promise<RobleLoginResponse> {
    const response = await firstValueFrom(
      this.http.post<RobleLoginResponse>(`${this.baseUrl}/login`, dto),
    );
    return response.data;
  }

  async refresh(dto: RefreshDto): Promise<RobleRefreshResponse> {
    const response = await firstValueFrom(
      this.http.post<RobleRefreshResponse>(
        `${this.baseUrl}/refresh-token`,
        dto,
      ),
    );
    return response.data;
  }

  async signup(dto: SignupDto): Promise<RobleGenericSuccess> {
    const response = await firstValueFrom(
      this.http.post<RobleGenericSuccess>(`${this.baseUrl}/signup`, dto),
    );
    return response.data;
  }

  async signupDirect(dto: SignupDto): Promise<RobleGenericSuccess> {
    const response = await firstValueFrom(
      this.http.post<RobleGenericSuccess>(`${this.baseUrl}/signup-direct`, dto),
    );
    return response.data;
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<RobleGenericSuccess> {
    const response = await firstValueFrom(
      this.http.post<RobleGenericSuccess>(`${this.baseUrl}/verify-email`, dto),
    );
    return response.data;
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    await firstValueFrom(
      this.http.post(`${this.baseUrl}/forgot-password`, dto),
    );
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    await firstValueFrom(this.http.post(`${this.baseUrl}/reset-password`, dto));
  }

  async logout(authHeader: string): Promise<void> {
    await firstValueFrom(
      this.http.post(`${this.baseUrl}/logout`, null, {
        headers: { Authorization: authHeader },
      }),
    );
  }

  async verifyToken(authHeader: string): Promise<RobleVerifyTokenResponse> {
    const response = await firstValueFrom(
      this.http.get<RobleVerifyTokenResponse>(`${this.baseUrl}/verify-token`, {
        headers: { Authorization: authHeader },
      }),
    );
    return response.data;
  }
}

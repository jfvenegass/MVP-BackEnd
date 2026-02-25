import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { SignupDto } from './dto/signup.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login de usuario' })
  @ApiResponse({ status: 201, description: 'Usuario autenticado correctamente.' })
  @ApiResponse({ status: 400, description: 'Credenciales inválidas.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refrescar access token' })
  @ApiResponse({ status: 201, description: 'Token actualizado correctamente.' })
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshDto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiBearerAuth('access-token') // indica que necesita JWT
  @ApiResponse({ status: 200, description: 'Logout exitoso' })
  async logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Registrar usuario (signup normal)' })
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente.' })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signup-direct')
  @ApiOperation({ summary: 'Registrar usuario directamente (sin verificación)' })
  @ApiResponse({ status: 201, description: 'Usuario registrado directamente.' })
  async signupDirect(@Body() signupDto: SignupDto) {
    return this.authService.signupDirect(signupDto);
  }
}
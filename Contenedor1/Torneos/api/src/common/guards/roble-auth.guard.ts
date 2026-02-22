import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { RobleService } from '../../roble/roble.service';
import type { RobleRequest } from '../types/roble-request';

@Injectable()
export class RobleAuthGuard implements CanActivate {
  constructor(private readonly roble: RobleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    const token = authHeader.substring(7).trim();
    if (!token) throw new UnauthorizedException('Empty token');

    const tokenInfo = await this.roble.verifyToken(token);

    const typedReq = req as RobleRequest;
    typedReq.accessToken = token;
    typedReq.robleUser = tokenInfo;

    return true;
  }
}

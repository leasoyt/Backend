import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    //console.log(token);
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }
    //const payload = this.jwtService.decode(token) as any;     verificacion de los datos que llegan por payload
    //console.log('Decoded Payload:', payload);
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Verificar si el usuario es administrador usando el campo isAdmin

      if (!payload.isAdmin) {
        throw new ForbiddenException('Access denied, admin only');
      }

      // Si es admin, añade los datos del usuario al request
      request.user = payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      }
      throw new ForbiddenException('Invalid or expired token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
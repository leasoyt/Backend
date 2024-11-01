import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { config as dotenvConfig } from 'dotenv';
import { log } from 'console';
import { UserRole } from 'src/enums/roles.enum';

dotenvConfig({ path: '.env' });

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log('tokee',token);
    

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      });

      payload.exp = new Date(payload.exp * 1000);
      payload.int = new Date(payload.int * 1000);
      payload.role =
        payload.role === UserRole.MANAGER
          ? [UserRole.MANAGER]
          : payload.role === UserRole.WAITER
            ? [UserRole.WAITER]
            : [UserRole.CONSUMER];
console.log('payload',payload);

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

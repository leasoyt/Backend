import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/enums/roles.enum';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { HttpMessagesEnum } from 'src/enums/httpMessages.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(HttpMessagesEnum.TOKEN_NOT_FOUND);
    }

    let payload;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = () => requiredRoles.some((role) => role === payload.role);

      if (!hasRole()) {
        throw new ForbiddenException(HttpMessagesEnum.INSUFFICIENT_PERMISSIONS);
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return undefined;
  }
}

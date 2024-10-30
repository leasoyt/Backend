import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { config as dotenvConfig } from 'dotenv';
import { UserRole } from 'src/enums/roles.enum';
dotenvConfig({ path: '.env' });

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token missing!');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      payload.exp = new Date(payload.exp * 1000);
      payload.int = new Date(payload.int * 1000);
      payload.role =
        payload.role === UserRole.MANAGER ?
          [UserRole.MANAGER] : payload.role === UserRole.WAITER ?
            [UserRole.WAITER] : payload.role === UserRole.ADMIN ?
              [UserRole.ADMIN] : [UserRole.CONSUMER];

      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

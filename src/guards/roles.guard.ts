import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { HttpMessagesEnum } from 'src/dtos/custom-responses.dto';
import { UserRole } from 'src/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector, private readonly jwtService: JwtService) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (token == undefined) {
      throw new ForbiddenException({ message: HttpMessagesEnum.UNAUTHORIZED, error: "Token not provided" });
    }

    const user = this.jwtService.verify(token);

    const has_roles: boolean = requiredRoles.some((role) => user?.role?.includes(role));

    if (!has_roles) {
      throw new ForbiddenException({ message: HttpMessagesEnum.UNAUTHORIZED, error: "You do not have the required role" });
    }

    return true;
  }
}

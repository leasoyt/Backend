import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';
import { Response } from 'express';
import { HttpMessagesEnum } from 'src/enums/httpMessages.enum';

@Catch(TokenExpiredError)
export class TokenExpiredExceptionFilter implements ExceptionFilter {

  catch(exception: TokenExpiredError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(401).json({
      statusCode: 401,
      message: HttpMessagesEnum.TOKEN_EXPIRED,
      error: 'Expired Token',
    });
  }
}
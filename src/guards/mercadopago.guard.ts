import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class MercadopagoGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const cabecera:string =  Array.isArray(request.headers) ? request.headers[0] : request.headers;
    const query = request.query;

    const firmaMercadoPago = cabecera['x-signature'];
    const idRequest = cabecera['x-request-id'];
    

    if (!firmaMercadoPago || !idRequest || !query) return false

    const idData = query['data.id']

    const partesfirmaMercadoPago = firmaMercadoPago.split(',')
    let marcaTiempo: string, firmaCabecera: string;

    partesfirmaMercadoPago.forEach(part => {
      // Split each part into key and value
      const [key, value] = part.split('=');
      if (key && value) {
          const trimmedKey = key.trim();
          const trimmedValue = value.trim();
          if (trimmedKey === 'ts') {
            marcaTiempo = trimmedValue;
          } else if (trimmedKey === 'v1') {
            firmaCabecera = trimmedValue;
          }
      }
    });

    const secret = '191d22bd549dcf361ae38ec50cbe1d5fbcf42446ae71bcd9c6a0515b66c83645';
    
    // Generate the manifest string
    const manifest = `id:${idData};request-id:${idRequest};ts:${marcaTiempo};`;

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(manifest);

    const sha = hmac.digest('hex');

    if (sha === firmaCabecera) {
        return true
    } else {
        return false
    }
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Email')
@Controller('mail')
export class MailController {
    constructor(
        private readonly mailService: MailService
    ){}

    @ApiOperation({
        description: 'Endpoint de prueba para enviar notificaciones por email sobre actuailzaciones del estado de la suscripción de un usuario',
        summary: 'Endpoint de prueba para enviar notificación por emal a un usuario'
    })
    @Post()
    @ApiBody({
        description: 'Cuerpo de la solicitud para probar el envío de suscripciones',
        schema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Juan Pérez',  // Ejemplo para el campo 'name'
            },
            email: {
              type: 'string',
              example: 'juan.perez@example.com',  // Ejemplo para el campo 'email'
            },
            freeTrial: {
              type: 'integer',
              example: 1,  // Ejemplo para el campo 'freeTrial'
            },
            message: {
              type: 'string',
              example: 'ha pasado un mes',  // Ejemplo para el campo 'message'
            },
          },
        },
      })
    async probarEnvioSuscripciones(@Body() usuario: {name: string, email: string, freeTrial: 1, message: string}){
        return this.mailService.sendNotificationPrueba(usuario)
    }
}

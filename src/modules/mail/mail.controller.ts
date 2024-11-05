import { Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
    async probarEnvioSuscripciones(){
        return this.mailService.sendNotificationEmail()
    }
}

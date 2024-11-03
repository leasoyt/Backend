import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SanitizedUserDto } from 'src/dtos/user/sanitized-user.dto';
import { PaymentsService } from '../payments/payments.service';
import { suscripcionesPrueba } from './suscripcionesPrueba/suscripcionesPrueba';
import { UserService } from '../user/user.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly paymentService: PaymentsService,
    private readonly userService: UserService
  ) {}


  async sendWelcomeEmail(userData:SanitizedUserDto):Promise<void>{
      console.log('Sending welcome email to:', userData.email);
      await this.mailerService.sendMail({
          from: 'Welcome <noreply@rest0.com>', // sender address
          to: userData.email, // destinatario
          subject: 'Welcome to our app',
          template: 'welcome',
          context: {
              userData, // Aquí pasamos el userData al template
            },
      });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async sendNotificationEmail(): Promise<void>{
    const suscripciones = await this.paymentService.getAllSuscription();
    // const suscripciones = suscripcionesPrueba;
    const diaActual = new Date()
    const idSubscriptiions = suscripciones
      .filter(suscripcion => {
        const fechaInicio = new Date(suscripcion.date_created);
        const fechaConUnMes = new Date(fechaInicio)
        fechaConUnMes.setMonth(fechaInicio.getMonth() + 1);
        return fechaConUnMes.toDateString() === diaActual.toDateString();
      })
      .map(suscripcion => (suscripcion.id));
    if( idSubscriptiions.length > 0 ) {
      const usuarioParaEnviarMail: SanitizedUserDto[] = await this.userService.getUsersBySuscription(idSubscriptiions);
      try {
        // const usuarioParaEnviarMail = [
        //   {name: 'Mario', email:'fportodos32@gmail.com'}
        // ]
        for await (const usuario of usuarioParaEnviarMail) {
          await this.mailerService.sendMail({
            from: 'Rest0<noreply@rest0.com>', // sender address
            to: usuario.email, // destinatario
            subject: 'RestO notification',
            template: 'notification',
            context: {
                usuario, // Aquí pasamos el userData al template
              },
          })
          console.log(`Correo enviado a ${usuario.email}`);
        }
      } catch (error) {
        console.log(error)
        throw error
      }
    } 
  }

}

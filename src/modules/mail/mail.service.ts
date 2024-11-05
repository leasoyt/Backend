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

  @Cron(CronExpression.EVERY_DAY_AT_11AM)
  async sendNotificationEmail(): Promise<void>{
    console.log('expresión cron funcionando')
    let suscripciones = await this.paymentService.getAllSuscription();
    // suscripciones = suscripcionesPrueba;
    const diaActual = new Date()
    const idSubscriptiions = suscripciones
      .map(suscription => {
        const fechaInicio = new Date(suscription.date_created);
        const fechaConUnMes = new Date(fechaInicio)
        fechaConUnMes.setMonth(fechaInicio.getMonth() + 1);
        const fechaConDosMeses = new Date(fechaInicio);
        fechaConDosMeses.setMonth(fechaInicio.getMonth() + 2)
        if (fechaConUnMes.toDateString() === diaActual.toDateString()) {
          return { id: suscription.id, freeTrial: 1, message: 'ha pasado un mes' }
        }
        else if (fechaConDosMeses.toDateString() === diaActual.toDateString()) {
          return { id: suscription.id, freeTrial: 2, message: 'han pasado dos meses' }
        }
        else {
          return { id: suscription.id, freeTrial: 3 }
        }
      })
      .filter(suscripcion => {
        return suscripcion.freeTrial === 1 || suscripcion.freeTrial === 2;
      })
    // console.log(idSubscriptiions);
    if( idSubscriptiions.length > 0 ) {
      const usuarioParaEnviarMail: SanitizedUserDto[] = await this.userService.getUsersBySuscription(idSubscriptiions);
      try {
        // const usuarioParaEnviarMail = [
        //   {name: 'Mario', email:'fportodos32@gmail.com', freeTrial: 1, message: 'ha pasado un mes'}
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

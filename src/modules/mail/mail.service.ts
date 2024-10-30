import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SanitizedUserDto } from 'src/dtos/user/sanitized-user.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}


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

}

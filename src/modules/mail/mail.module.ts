import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { PaymentsModule } from '../payments/payments.module';
import { MailController } from './mail.controller';
import { UsersModule } from '../user/user.module';

@Module({
    imports: [PaymentsModule, UsersModule],
    providers: [MailService],
    exports: [MailService],
    controllers: [MailController]
})
export class MailModule {}

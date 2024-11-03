import { Module} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { UsersModule } from '../user/user.module';
import { MercadoPagoProvider } from 'src/config/mercadoPago.config';


@Module({
  imports: [UsersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, MercadoPagoProvider],
  exports: [PaymentsService]
})
export class PaymentsModule {}

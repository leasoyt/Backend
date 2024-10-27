import { Inject, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, PreApproval} from 'mercadopago';
import { UserService } from '../user/user.service';
import { CreatePaymentDto } from 'src/dtos/payment.dto';
import { BodyToPreaprobalAnnual } from 'src/config/annualSubscriptionMercadoPago.config'

@Injectable()
export class PaymentsService {
  constructor(private readonly userService: UserService, @Inject('MercadoPago') private readonly mercadoPago: MercadoPagoConfig) {}
  async create(createPaymentDto: CreatePaymentDto) {
    const preapproval = new PreApproval(this.mercadoPago)
    let body = BodyToPreaprobalAnnual;
    try {
      const response = await preapproval.create({ body });
      this.userService.addSubscriptionToUser(createPaymentDto.email, response.id)
      return response;
    } catch (error) {
      console.error('Error creating preapproval: ', error);
      throw error;
    }
  }

  async cancelSubscription(idSubscription: string) {
    const preapproval = new PreApproval(this.mercadoPago)
    try {
      const response = await preapproval.update({
        id: '02866924c9a0446583bba83c1868f8ba',
        body: {
          status: "cancelled"
        }
      })
      return response;
    } catch (error) {
      console.log(error)
    }
    
  }
  
  async receiverWebhook(body: any) {
    // console.log(body.data.id)
    const preapproval = new PreApproval(this.mercadoPago)
    try {
      const updatedsubscription = await preapproval.get({id: '02866924c9a0446583bba83c1868f8ba'});
      const idSubscriptionUptaded = updatedsubscription.id
      const updatedsubscriptionStatus = updatedsubscription.status 
      await this.userService.updateSubscriptionStatus(idSubscriptionUptaded, updatedsubscriptionStatus)
      console.log(idSubscriptionUptaded);
      console.log(updatedsubscriptionStatus);
    } catch (error) {
      console.error('Error searching preapproval: ', error);
      throw error;
    }
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, PreApproval} from 'mercadopago';
import { UserService } from '../user/user.service';
import { CreatePaymentDto } from 'src/dtos/payment/payment.dto';
import { BodyToPreaprobalAnnual } from 'src/config/annualSubscriptionMercadoPago.config'
import { CancelSubscriptionDto } from 'src/dtos/payment/cancelPayment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly userService: UserService, @Inject('MercadoPago') private readonly mercadoPago: MercadoPagoConfig) {}

  private preaproval;
  
  onModuleInit(){
    this.preaproval = new PreApproval(this.mercadoPago)
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<string> {
    const preapproval = new PreApproval(this.mercadoPago)
    let body = BodyToPreaprobalAnnual;
    // body.payer_email = createPaymentDto.email;
    try {
      const response = await preapproval.create({ body });
      // this.userService.addSubscriptionToUser(response.payer_email, response.id)
      await this.userService.addSubscriptionToUser('test_user_992596436@testuser.com', response.id, response.status);
      return response.init_point;
    } catch (error) {
      console.error('Error creating preapproval: ', error);
      throw error;
    }
  }

  async cancelSubscription(cancelSubscription: CancelSubscriptionDto) {
    const preapproval = new PreApproval(this.mercadoPago)
    let id: string;
    id = cancelSubscription.idSubscription;
    // id = 'c55d591e09cb49c78a3d036c5d2bf9c9';
    try {
      const response = await preapproval.update({
        id: id,
        body: {
          status: "cancelled"
        }
      })
      await this.userService.updateSubscriptionStatus(response.id, response.status)
      const subscriptionCancelled = {
        id: response.id,
        status: response.status
      }
      return subscriptionCancelled;
    } catch (error) {
      throw error
    }
    
  }

  async getAllSuscription(){
    try {
      const allSuscription = await this.preaproval.search({
        options: {
          limit: 10
        }
      })
      return allSuscription.results;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
  
  async receiverWebhook(body: any) {
    const idSubscriptionUpdated = body.data.id;
    const preapproval = new PreApproval(this.mercadoPago)
    preapproval.search
    try {
      const updatedsubscription = await preapproval.get({id: idSubscriptionUpdated});
      const idSubscriptionUptaded = updatedsubscription.id
      const updatedsubscriptionStatus = updatedsubscription.status 
      await this.userService.updateSubscriptionStatus(idSubscriptionUptaded, updatedsubscriptionStatus)
    } catch (error) {
      console.error('Error searching preapproval: ', error);
      throw error;
    }
  }
}

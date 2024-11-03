import { Injectable } from "@nestjs/common";
import { error } from "console";
import MercadoPagoConfig, { PreApprovalPlan } from "mercadopago";
import path from "path";
import { SubscriptionOptions } from "src/enums/subscriptionOptions.enum";

@Injectable()
export class PaymentSeeder {
  private readonly cliente;
  constructor(){
    this.cliente = new MercadoPagoConfig({
      accessToken: 'APP_USR-7920252870111813-102209-232ad587351038e2eb666b1bc4f41b0b-2049054865', // Replace with your actual access token
      options: { timeout: 5000 },
    })
  }
  async seed(): Promise<void> {
    const preapprovalPlan = new PreApprovalPlan(this.cliente);
    // try {
    //   const preaprobalPlanFree = await preapprovalPlan.get({preApprovalPlanId: '2c93808492bf1ff80192cc72316703e9'});
    //   console.log(preaprobalPlanFree)
    // } catch (error) {
    //   console.log(`${error.message} se creara un nuevo preaprobal plan`)
    // }
    try {
      const body = {
        reason: SubscriptionOptions.ANNUAL,
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          repetitions: 12,
          billing_day: 1,
          transaction_amount: 10,
          currency_id: 'MXN'
        },
        back_url: 'https://www.your-app.com/confirmation',
      }
      const preaprobalPlanAnnual = await preapprovalPlan.create({body: body})
      console.log(preaprobalPlanAnnual)
    } catch (error) {
      console.log(error)
    }
  }
}
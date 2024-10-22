import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

@Injectable()
export class PaymentsService {
  constructor() {}
  async create(createPaymentDto: any) {
    // Step 1: Initialize the Mercado Pago client
    const client = new MercadoPagoConfig({
      accessToken: 'APP_USR-7920252870111813-102209-232ad587351038e2eb666b1bc4f41b0b-2049054865', // Replace with your actual access token
      options: { timeout: 5000 },
    })
    const preapproval = new PreApproval(client)
    const body = {
      reason: 'Suscripción mensual',
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: 1000, // Amount for the subscription
        currency_id: "MXN", // Currency
        start_date: new Date().toISOString(), // Start date
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // End date
      },
      payer_email: 'test_user_992596436@testuser.com',
      back_url: 'https://www.your-app.com/confirmation', // Redirect URL after payment
    };
    try {
      const response = await preapproval.create({ body });
      // The response contains the init_point URL for redirection
      console.log(response.init_point)
      return response.init_point;
    } catch (error) {
      console.error('Error creating preapproval: ', error);
      throw error;
    }
  }

  // findAll() {
  //   return `This action returns all payments`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} payment`;
  // }

  // update(id: number, updatePaymentDto: UpdatePaymentDto) {
  //   return `This action updates a #${id} payment`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} payment`;
  // }
}

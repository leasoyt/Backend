import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Headers, UseGuards, ParseUUIDPipe, Put } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MercadopagoGuard } from 'src/guards/mercadopago.guard';
import { CreatePaymentDto } from 'src/dtos/payment/payment.dto';
import { CancelSubscriptionDto } from 'src/dtos/payment/cancelPayment.dto';

@ApiTags('Pagos con mercadopago')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  
  @ApiOperation({ summary: "Permite realizar el pago por una suscripción a esta página" })
  @Post('create')
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentsService.create(createPaymentDto);
  }

  @UseGuards(MercadopagoGuard)
  @Post('webhook')
  @ApiOperation({ summary: "Recibe notificaciones de mercadopago sobre actualizacione en los pagos" })
  async receiverWebhook(@Body() body) {
    const respuesta =  await this.paymentsService.receiverWebhook(body);
    return;
  }

  @ApiOperation({ summary: "Cancela una suscripción" })
  @Put('cancel')
  async cancelarSubscription(@Body() cancelPayment: CancelSubscriptionDto){
    const respuesta = await this.paymentsService.cancelSubscription(cancelPayment)
    return respuesta;
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Headers, UseGuards, ParseUUIDPipe, Put } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MercadopagoGuard } from 'src/guards/mercadopago.guard';
import { CreatePaymentDto } from 'src/dtos/payment.dto';

@ApiTags('Pagos con mercadopago')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  
  @ApiOperation({ summary: "Permite realizar el pago por una suscripción a esta página" })
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @UseGuards(MercadopagoGuard)
  @Post('webhook')
  @ApiOperation({ summary: "Recibe notificaciones de mercadopago sobre actualizacione en los pagos" })
  receiverWebhook(@Body() body){
    const respuesta = this.paymentsService.receiverWebhook(body);
    return;
  }

  @Put('cancel:id')
  cancelarSubscription(@Param() idSubscription: string){
    const respuesta = this.paymentsService.cancelSubscription(idSubscription)
    return respuesta;
  }
  // @Get()
  // findAll() {
  //   return this.paymentsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.paymentsService.findOne(+id);
  // }

 
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.paymentsService.remove(+id);
  // }
}

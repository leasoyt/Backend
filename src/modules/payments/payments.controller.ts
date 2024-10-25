import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Headers } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Pagos con mercadopago')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  
  @ApiOperation({ summary: "Permite realizar el pago por una suscripción a esta página" })
  @Post()
  create(@Body() createPaymentDto: any) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Post('webhook')
  @ApiOperation({ summary: "Recibe notificaciones de mercadopago sobre actualizacione en los pagos" })
  receiverWebhook(@Query() query: any, @Body() body: any, @Headers() cabecera: any){
    const respuesta = this.paymentsService.receiverWebhook(query, body, cabecera);
    return;
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

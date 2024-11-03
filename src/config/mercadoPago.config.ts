import { Provider } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
import { MercadoPagoConfig } from 'mercadopago';

dotenvConfig({path:'.env'});

export const MercadoPagoProvider: Provider = {
  provide: 'MercadoPago',
  useFactory: () => {
    return new MercadoPagoConfig({
      accessToken: process.env.ACCESS_TOKEN_MERCADOPAGO, // Usa una variable de entorno
      options: { timeout: 5000 },
    });
  },
};

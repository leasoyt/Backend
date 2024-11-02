import { Provider } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
import { Wit } from 'node-wit'

dotenvConfig({path:'.env'});

export const WitProvider: Provider = {
  provide: 'Wit',
  useFactory: () => {
    return new Wit({
        accessToken: process.env.WITTOKEN,
      });
  },
};
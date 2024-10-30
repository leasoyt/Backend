import { TypeOrmModule } from '@nestjs/typeorm';
import { DishModule } from './modules/dish/dish.module';
import { UsersModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import TypeOrmConfig from './config/database.config';
import { MenuModule } from './modules/menu/menu.module';
import { OrderModule } from './modules/order/order.module';
import { MenuCategoryModule } from './modules/menu_category/menu_category.module';
import { Module } from '@nestjs/common';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { JwtModule } from '@nestjs/jwt';
import { PaymentsModule } from './modules/payments/payments.module';
import { UploadModule } from './uploads/upload.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guards/jwt.strategy';
import { ReservationModule } from './modules/reservation/reservation.module';
import { ChatModule } from './modules/chat/chat.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: configService.get('NODEMAILER_USER'),
            pass: configService.get('NODEMAILER_PASSWORD'),
          },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: 'src/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),

    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [TypeOrmConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),

    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
    AuthModule,
    DishModule,
    MenuModule,
    OrderModule,
    MenuCategoryModule,
    RestaurantModule,
    PaymentsModule,
    UploadModule,
    ReservationModule,
    ChatModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}

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


@Module({
  imports: [
   

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
    UsersModule,
    AuthModule,
    DishModule,
    MenuModule,
    OrderModule,
    MenuCategoryModule,
    RestaurantModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

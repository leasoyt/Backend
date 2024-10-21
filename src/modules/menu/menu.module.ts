import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from 'src/entities/menu.entity';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuRepository } from './menu.repository';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { Restaurant } from 'src/entities/restaurant.entity';

@Module({
  imports: [forwardRef(()=> RestaurantModule) , TypeOrmModule.forFeature([Menu,Restaurant])],
  controllers: [MenuController],
  providers: [MenuService, MenuRepository],
  exports: [MenuService]
})
export class MenuModule { }

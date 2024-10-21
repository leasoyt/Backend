import { Module } from '@nestjs/common';
import { MenuCategoryController } from './menu_category.controller';
import { MenuCategoryService } from './menu_category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu_Category } from 'src/entities/menu_category.entity';
import { Menu } from 'src/entities/menu.entity';
import { MenuModule } from '../menu/menu.module';
import { Menu_Category_Repository } from './menu_category.repository';

@Module({
  imports:[MenuModule,TypeOrmModule.forFeature([Menu_Category,Menu])],
  controllers: [MenuCategoryController],
  providers: [MenuCategoryService,Menu_Category_Repository],
  exports:[MenuCategoryService]
})
export class MenuCategoryModule {}

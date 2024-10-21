import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Restaurant_Table } from "src/entities/tables.entity";
import { TableController } from "./table.controller";
import { TableService } from "./table.service";
import { TableRepository } from "./table.repository";
import { RestaurantModule } from "../restaurant/restaurant.module";

@Module({
    imports: [RestaurantModule, TypeOrmModule.forFeature([Restaurant_Table])],
    controllers: [TableController],
    providers: [TableService, TableRepository],
    exports: [TableService]
})
export class TableModule { }
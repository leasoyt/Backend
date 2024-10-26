import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant_Table } from 'src/entities/tables.entity';
import { Repository, Table } from 'typeorm';

// Sólo para probar mientras está listo en repositorio oficial de Table

@Injectable()
export class TableRepository {
  constructor(
    @InjectRepository(Restaurant_Table)
    private tableRepository: Repository<Restaurant_Table>,
  ) {}
  async getTableById(id: string): Promise<null | Restaurant_Table> {
    const foundedTable: null | Restaurant_Table =
      await this.tableRepository.findOneBy({ id });
    return foundedTable;
  }
}

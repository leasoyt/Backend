import { MigrationInterface, QueryRunner } from "typeorm";

export class CambioDeJoinTableParaOrderDetailYdish1729468780189 implements MigrationInterface {
    name = 'CambioDeJoinTableParaOrderDetailYdish1729468780189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dish_order_detail" DROP CONSTRAINT "FK_760073be5484aacee86b9e7172a"`);
        await queryRunner.query(`ALTER TABLE "dish_order_detail" DROP CONSTRAINT "FK_94c5b6448f9ac7b9f67b7083881"`);
        await queryRunner.query(`ALTER TABLE "dish_order_detail" ADD CONSTRAINT "FK_760073be5484aacee86b9e7172a" FOREIGN KEY ("order_detail_id") REFERENCES "order_detail"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "dish_order_detail" ADD CONSTRAINT "FK_94c5b6448f9ac7b9f67b7083881" FOREIGN KEY ("dish_id") REFERENCES "dish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dish_order_detail" DROP CONSTRAINT "FK_94c5b6448f9ac7b9f67b7083881"`);
        await queryRunner.query(`ALTER TABLE "dish_order_detail" DROP CONSTRAINT "FK_760073be5484aacee86b9e7172a"`);
        await queryRunner.query(`ALTER TABLE "dish_order_detail" ADD CONSTRAINT "FK_94c5b6448f9ac7b9f67b7083881" FOREIGN KEY ("dish_id") REFERENCES "dish"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "dish_order_detail" ADD CONSTRAINT "FK_760073be5484aacee86b9e7172a" FOREIGN KEY ("order_detail_id") REFERENCES "order_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

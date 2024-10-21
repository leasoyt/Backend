import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdicionStatusOrden1729455891065 implements MigrationInterface {
  name = 'AdicionStatusOrden1729455891065';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_enum" AS ENUM('processing', 'cancelled', 'completed', 'paid')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "status" "public"."order_status_enum" NOT NULL DEFAULT 'processing'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Fixed1730145158377 implements MigrationInterface {
    name = 'Fixed1730145158377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu" ADD "restaurantId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "subscription" SET DEFAULT 'nothing'`);
        await queryRunner.query(`ALTER TABLE "menu" ADD CONSTRAINT "FK_085156de3c3a44eba017a6a0846" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu" DROP CONSTRAINT "FK_085156de3c3a44eba017a6a0846"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "subscription" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "menu" DROP COLUMN "restaurantId"`);
    }

}

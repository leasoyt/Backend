import { MigrationInterface, QueryRunner } from "typeorm";

export class Nonullablemenu1730162400655 implements MigrationInterface {
    name = 'Nonullablemenu1730162400655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "FK_5a6420c3086d9d50d001cc01713"`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "menu_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "FK_5a6420c3086d9d50d001cc01713" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "FK_5a6420c3086d9d50d001cc01713"`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "menu_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "FK_5a6420c3086d9d50d001cc01713" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class OnCascadeDishAndMore1730231011102 implements MigrationInterface {
    name = 'OnCascadeDishAndMore1730231011102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dish" DROP CONSTRAINT "FK_f101936095917dde2a9f0609516"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "FK_5a6420c3086d9d50d001cc01713"`);
        await queryRunner.query(`ALTER TABLE "dish" ADD CONSTRAINT "FK_f101936095917dde2a9f0609516" FOREIGN KEY ("categoryId") REFERENCES "menu_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "FK_5a6420c3086d9d50d001cc01713" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "FK_5a6420c3086d9d50d001cc01713"`);
        await queryRunner.query(`ALTER TABLE "dish" DROP CONSTRAINT "FK_f101936095917dde2a9f0609516"`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "FK_5a6420c3086d9d50d001cc01713" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dish" ADD CONSTRAINT "FK_f101936095917dde2a9f0609516" FOREIGN KEY ("categoryId") REFERENCES "menu_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class CambioRelacionesEnUser1731735583276 implements MigrationInterface {
    name = 'CambioRelacionesEnUser1731735583276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "FK_7a0df7028ab735331618a439bb2"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_46bd4688044889498eae892e959"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "managerId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isAdmin"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "waiterRestaurantId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "waiter_in" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD "owns_restaurant" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_e9fe557e04752c470ae5c9ac9ba" UNIQUE ("owns_restaurant")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_fc7f5b77bfe9a398d304cdcf684" FOREIGN KEY ("waiter_in") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_e9fe557e04752c470ae5c9ac9ba" FOREIGN KEY ("owns_restaurant") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_e9fe557e04752c470ae5c9ac9ba"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_fc7f5b77bfe9a398d304cdcf684"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_e9fe557e04752c470ae5c9ac9ba"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "owns_restaurant"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "waiter_in"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "waiterRestaurantId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isAdmin" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "managerId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_46bd4688044889498eae892e959" FOREIGN KEY ("waiterRestaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "FK_7a0df7028ab735331618a439bb2" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1729310208516 implements MigrationInterface {
    name = 'Initial1729310208516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_9924ddc82b8d169d2f59bc7baef"`);
        await queryRunner.query(`ALTER TABLE "reservations" RENAME COLUMN "user" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "dish" ADD CONSTRAINT "UQ_07626606a3b574903a702fd6ae6" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_aa0e1cc2c4f54da32bf8282154c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_aa0e1cc2c4f54da32bf8282154c"`);
        await queryRunner.query(`ALTER TABLE "dish" DROP CONSTRAINT "UQ_07626606a3b574903a702fd6ae6"`);
        await queryRunner.query(`ALTER TABLE "reservations" RENAME COLUMN "userId" TO "user"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_9924ddc82b8d169d2f59bc7baef" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

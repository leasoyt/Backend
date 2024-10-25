import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRating1729705851453 implements MigrationInterface {
    name = 'AddRating1729705851453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "rating" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "rating"`);
    }

}

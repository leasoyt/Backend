import { MigrationInterface, QueryRunner } from "typeorm";

export class SoftDeleteAdded1730754797237 implements MigrationInterface {
    name = 'SoftDeleteAdded1730754797237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" ADD "was_deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "was_deleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "profile_image" SET DEFAULT 'https://res.cloudinary.com/dvgvcleky/image/upload/f_auto,q_auto/v1/RestO/ffgx6ywlaix0mb3jghux'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "profile_image" SET DEFAULT 'default-image-url.jpg'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "was_deleted"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "was_deleted"`);
    }

}

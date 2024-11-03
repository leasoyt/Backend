import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubscritionAndSusbcriptionStatusToUser1730039566609 implements MigrationInterface {
    name = 'AddSubscritionAndSusbcriptionStatusToUser1730039566609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_subscriptionstatus_enum" AS ENUM('pendig', 'authorized', 'paused', 'cancelled', 'nothing')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "subscriptionStatus" "public"."users_subscriptionstatus_enum" NOT NULL DEFAULT 'nothing'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "subscription" character varying`);
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "imgUrl" SET DEFAULT 'https://res.cloudinary.com/dvgvcleky/image/upload/v1729701300/RestO/c4pyhwljetkgahtkwkpi.webp'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "imgUrl" SET DEFAULT 'default-image-url.jpg'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "subscription"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "subscriptionStatus"`);
        await queryRunner.query(`DROP TYPE "public"."users_subscriptionstatus_enum"`);
    }

}

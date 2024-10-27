import { MigrationInterface, QueryRunner } from "typeorm";

export class CambiodeUrl1729987889351 implements MigrationInterface {
    name = 'CambiodeUrl1729987889351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "imgUrl" SET DEFAULT 'https://res.cloudinary.com/dvgvcleky/image/upload/v1729701300/RestO/c4pyhwljetkgahtkwkpi.webp'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "restaurant" ALTER COLUMN "imgUrl" SET DEFAULT 'default-image-url.jpg'`);
    }

}

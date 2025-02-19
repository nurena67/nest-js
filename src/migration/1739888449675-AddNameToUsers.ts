import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameToUsers1739888449675 implements MigrationInterface {
    name = 'AddNameToUsers1739888449675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    }

}

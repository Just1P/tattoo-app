import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSoftDelete1738800100000 implements MigrationInterface {
  name = 'AddSoftDelete1738800100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD "deletedAt" TIMESTAMP
    `);

    await queryRunner.query(`
      ALTER TABLE "posts"
      ADD "deletedAt" TIMESTAMP
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_user_deletedAt" ON "users" ("deletedAt")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_post_deletedAt" ON "posts" ("deletedAt")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_post_deletedAt"`);
    await queryRunner.query(`DROP INDEX "IDX_user_deletedAt"`);

    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
  }
}

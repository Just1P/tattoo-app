import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1738800000000 implements MigrationInterface {
  name = 'InitialMigration1738800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "firstName" character varying,
        "lastName" character varying,
        "phone" character varying,
        "bio" character varying,
        "location" character varying,
        "website" character varying,
        "instagram" character varying,
        "avatar" character varying,
        "userType" character varying NOT NULL DEFAULT 'client',
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "posts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "images" json,
        "tags" json,
        "category" character varying NOT NULL DEFAULT 'tattoo',
        "isPublic" boolean NOT NULL DEFAULT false,
        "likesCount" integer NOT NULL DEFAULT 0,
        "commentsCount" integer NOT NULL DEFAULT 0,
        "location" character varying,
        "price" numeric(10,2),
        "status" character varying NOT NULL DEFAULT 'available',
        "authorId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_posts" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "likes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "postId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_likes" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_user_email" ON "users" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_userType" ON "users" ("userType")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_isActive" ON "users" ("isActive")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_post_authorId" ON "posts" ("authorId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_post_category" ON "posts" ("category")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_post_status" ON "posts" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_post_isPublic" ON "posts" ("isPublic")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_post_createdAt" ON "posts" ("createdAt" DESC)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_post_likesCount" ON "posts" ("likesCount" DESC)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_post_category_status" ON "posts" ("category", "status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_like_userId" ON "likes" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_like_postId" ON "likes" ("postId")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_like_userId_postId" ON "likes" ("userId", "postId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_like_createdAt" ON "likes" ("createdAt" DESC)`,
    );

    await queryRunner.query(`
      ALTER TABLE "posts"
      ADD CONSTRAINT "FK_post_author"
      FOREIGN KEY ("authorId")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "likes"
      ADD CONSTRAINT "FK_like_user"
      FOREIGN KEY ("userId")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "likes"
      ADD CONSTRAINT "FK_like_post"
      FOREIGN KEY ("postId")
      REFERENCES "posts"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ADD CONSTRAINT "CHK_userType"
      CHECK ("userType" IN ('client', 'artist'))
    `);

    await queryRunner.query(`
      ALTER TABLE "posts"
      ADD CONSTRAINT "CHK_category"
      CHECK ("category" IN ('tattoo', 'flash', 'inspiration', 'other'))
    `);

    await queryRunner.query(`
      ALTER TABLE "posts"
      ADD CONSTRAINT "CHK_status"
      CHECK ("status" IN ('available', 'booked', 'completed'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "likes" DROP CONSTRAINT "FK_like_post"`,
    );
    await queryRunner.query(
      `ALTER TABLE "likes" DROP CONSTRAINT "FK_like_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_post_author"`,
    );

    await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "CHK_status"`);
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "CHK_category"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "CHK_userType"`,
    );

    await queryRunner.query(`DROP INDEX "IDX_like_createdAt"`);
    await queryRunner.query(`DROP INDEX "IDX_like_userId_postId"`);
    await queryRunner.query(`DROP INDEX "IDX_like_postId"`);
    await queryRunner.query(`DROP INDEX "IDX_like_userId"`);
    await queryRunner.query(`DROP INDEX "IDX_post_category_status"`);
    await queryRunner.query(`DROP INDEX "IDX_post_likesCount"`);
    await queryRunner.query(`DROP INDEX "IDX_post_createdAt"`);
    await queryRunner.query(`DROP INDEX "IDX_post_isPublic"`);
    await queryRunner.query(`DROP INDEX "IDX_post_status"`);
    await queryRunner.query(`DROP INDEX "IDX_post_category"`);
    await queryRunner.query(`DROP INDEX "IDX_post_authorId"`);
    await queryRunner.query(`DROP INDEX "IDX_user_isActive"`);
    await queryRunner.query(`DROP INDEX "IDX_user_userType"`);
    await queryRunner.query(`DROP INDEX "IDX_user_email"`);

    await queryRunner.query(`DROP TABLE "likes"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}

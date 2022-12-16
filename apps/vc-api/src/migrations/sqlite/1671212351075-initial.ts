import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1671212351075 implements MigrationInterface {
  name = 'initial1671212351075';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "key_pair" (
                "publicKeyThumbprint" text PRIMARY KEY NOT NULL,
                "privateKey" text NOT NULL,
                "publicKey" text NOT NULL
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "verification_method_entity" (
                "id" text PRIMARY KEY NOT NULL,
                "type" text NOT NULL,
                "controller" text NOT NULL,
                "publicKeyJwk" text NOT NULL,
                "didDocId" text
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "did_document_entity" ("id" text PRIMARY KEY NOT NULL)
        `);
    await queryRunner.query(`
            CREATE TABLE "presentation_review_entity" (
                "presentationReviewId" text PRIMARY KEY NOT NULL,
                "reviewStatus" text NOT NULL,
                "VP" text
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "vp_request_entity" (
                "challenge" text PRIMARY KEY NOT NULL,
                "query" text NOT NULL,
                "interact" text NOT NULL
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "presentation_submission_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "verificationResult" text NOT NULL,
                "vpHolder" text
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "transaction_entity" (
                "transactionId" text PRIMARY KEY NOT NULL,
                "exchangeId" text NOT NULL,
                "callback" text NOT NULL,
                "vpRequestChallenge" text,
                "presentationReviewPresentationReviewId" text,
                "presentationSubmissionId" integer,
                CONSTRAINT "REL_5e96363fa922f4da9b2b047547" UNIQUE ("vpRequestChallenge"),
                CONSTRAINT "REL_459beced792faed537ed4811ba" UNIQUE ("presentationReviewPresentationReviewId"),
                CONSTRAINT "REL_e7ce43da4087c1785294a7fc75" UNIQUE ("presentationSubmissionId")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "exchange_entity" (
                "exchangeId" text PRIMARY KEY NOT NULL,
                "oneTimeTransactionId" text,
                "interactServiceDefinitions" text NOT NULL,
                "query" text NOT NULL,
                "callback" text NOT NULL
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "temporary_verification_method_entity" (
                "id" text PRIMARY KEY NOT NULL,
                "type" text NOT NULL,
                "controller" text NOT NULL,
                "publicKeyJwk" text NOT NULL,
                "didDocId" text,
                CONSTRAINT "FK_22a35d6fd3bd1da64cb0752cbb3" FOREIGN KEY ("didDocId") REFERENCES "did_document_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
    await queryRunner.query(`
            INSERT INTO "temporary_verification_method_entity"(
                    "id",
                    "type",
                    "controller",
                    "publicKeyJwk",
                    "didDocId"
                )
            SELECT "id",
                "type",
                "controller",
                "publicKeyJwk",
                "didDocId"
            FROM "verification_method_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "verification_method_entity"
        `);
    await queryRunner.query(`
            ALTER TABLE "temporary_verification_method_entity"
                RENAME TO "verification_method_entity"
        `);
    await queryRunner.query(`
            CREATE TABLE "temporary_transaction_entity" (
                "transactionId" text PRIMARY KEY NOT NULL,
                "exchangeId" text NOT NULL,
                "callback" text NOT NULL,
                "vpRequestChallenge" text,
                "presentationReviewPresentationReviewId" text,
                "presentationSubmissionId" integer,
                CONSTRAINT "REL_5e96363fa922f4da9b2b047547" UNIQUE ("vpRequestChallenge"),
                CONSTRAINT "REL_459beced792faed537ed4811ba" UNIQUE ("presentationReviewPresentationReviewId"),
                CONSTRAINT "REL_e7ce43da4087c1785294a7fc75" UNIQUE ("presentationSubmissionId"),
                CONSTRAINT "FK_5e96363fa922f4da9b2b0475477" FOREIGN KEY ("vpRequestChallenge") REFERENCES "vp_request_entity" ("challenge") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_459beced792faed537ed4811ba8" FOREIGN KEY ("presentationReviewPresentationReviewId") REFERENCES "presentation_review_entity" ("presentationReviewId") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_e7ce43da4087c1785294a7fc75d" FOREIGN KEY ("presentationSubmissionId") REFERENCES "presentation_submission_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
    await queryRunner.query(`
            INSERT INTO "temporary_transaction_entity"(
                    "transactionId",
                    "exchangeId",
                    "callback",
                    "vpRequestChallenge",
                    "presentationReviewPresentationReviewId",
                    "presentationSubmissionId"
                )
            SELECT "transactionId",
                "exchangeId",
                "callback",
                "vpRequestChallenge",
                "presentationReviewPresentationReviewId",
                "presentationSubmissionId"
            FROM "transaction_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "transaction_entity"
        `);
    await queryRunner.query(`
            ALTER TABLE "temporary_transaction_entity"
                RENAME TO "transaction_entity"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "transaction_entity"
                RENAME TO "temporary_transaction_entity"
        `);
    await queryRunner.query(`
            CREATE TABLE "transaction_entity" (
                "transactionId" text PRIMARY KEY NOT NULL,
                "exchangeId" text NOT NULL,
                "callback" text NOT NULL,
                "vpRequestChallenge" text,
                "presentationReviewPresentationReviewId" text,
                "presentationSubmissionId" integer,
                CONSTRAINT "REL_5e96363fa922f4da9b2b047547" UNIQUE ("vpRequestChallenge"),
                CONSTRAINT "REL_459beced792faed537ed4811ba" UNIQUE ("presentationReviewPresentationReviewId"),
                CONSTRAINT "REL_e7ce43da4087c1785294a7fc75" UNIQUE ("presentationSubmissionId")
            )
        `);
    await queryRunner.query(`
            INSERT INTO "transaction_entity"(
                    "transactionId",
                    "exchangeId",
                    "callback",
                    "vpRequestChallenge",
                    "presentationReviewPresentationReviewId",
                    "presentationSubmissionId"
                )
            SELECT "transactionId",
                "exchangeId",
                "callback",
                "vpRequestChallenge",
                "presentationReviewPresentationReviewId",
                "presentationSubmissionId"
            FROM "temporary_transaction_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "temporary_transaction_entity"
        `);
    await queryRunner.query(`
            ALTER TABLE "verification_method_entity"
                RENAME TO "temporary_verification_method_entity"
        `);
    await queryRunner.query(`
            CREATE TABLE "verification_method_entity" (
                "id" text PRIMARY KEY NOT NULL,
                "type" text NOT NULL,
                "controller" text NOT NULL,
                "publicKeyJwk" text NOT NULL,
                "didDocId" text
            )
        `);
    await queryRunner.query(`
            INSERT INTO "verification_method_entity"(
                    "id",
                    "type",
                    "controller",
                    "publicKeyJwk",
                    "didDocId"
                )
            SELECT "id",
                "type",
                "controller",
                "publicKeyJwk",
                "didDocId"
            FROM "temporary_verification_method_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "temporary_verification_method_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "exchange_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "transaction_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "presentation_submission_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "vp_request_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "presentation_review_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "did_document_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "verification_method_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "key_pair"
        `);
  }
}

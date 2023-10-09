import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1671212337326 implements MigrationInterface {
  name = 'initial1671212337326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "verification_method_entity" (
                "id" text NOT NULL,
                "type" text NOT NULL,
                "controller" text NOT NULL,
                "publicKeyJwk" text NOT NULL,
                "didDocId" text,
                CONSTRAINT "PK_505ddb773de428509f34ec87209" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "did_document_entity" (
                "id" text NOT NULL,
                CONSTRAINT "PK_d96048f4c93be203eeff05ef404" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "key_pair" (
                "publicKeyThumbprint" text NOT NULL,
                "privateKey" text NOT NULL,
                "publicKey" text NOT NULL,
                CONSTRAINT "PK_ece1198fe2393a8c259275a85d6" PRIMARY KEY ("publicKeyThumbprint")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "presentation_review_entity" (
                "presentationReviewId" text NOT NULL,
                "reviewStatus" text NOT NULL,
                "VP" text,
                CONSTRAINT "PK_c2c1ceaca83537e7ced45484865" PRIMARY KEY ("presentationReviewId")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "vp_request_entity" (
                "challenge" text NOT NULL,
                "query" text NOT NULL,
                "interact" text NOT NULL,
                CONSTRAINT "PK_7fd8f399d2d73c465a5d22861e7" PRIMARY KEY ("challenge")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "presentation_submission_entity" (
                "id" SERIAL NOT NULL,
                "verificationResult" text NOT NULL,
                "vpHolder" text,
                CONSTRAINT "PK_3c0c233f2d67daa3d5ee759ec71" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "transaction_entity" (
                "transactionId" text NOT NULL,
                "exchangeId" text NOT NULL,
                "callback" text NOT NULL,
                "vpRequestChallenge" text,
                "presentationReviewPresentationReviewId" text,
                "presentationSubmissionId" integer,
                CONSTRAINT "REL_5e96363fa922f4da9b2b047547" UNIQUE ("vpRequestChallenge"),
                CONSTRAINT "REL_459beced792faed537ed4811ba" UNIQUE ("presentationReviewPresentationReviewId"),
                CONSTRAINT "REL_e7ce43da4087c1785294a7fc75" UNIQUE ("presentationSubmissionId"),
                CONSTRAINT "PK_3586b024b673dad2e0e3bd4f20d" PRIMARY KEY ("transactionId")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "exchange_entity" (
                "exchangeId" text NOT NULL,
                "oneTimeTransactionId" text,
                "interactServiceDefinitions" text NOT NULL,
                "query" text NOT NULL,
                "callback" text NOT NULL,
                CONSTRAINT "PK_6349a22c62ba5be8212099c7bbc" PRIMARY KEY ("exchangeId")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "verification_method_entity"
            ADD CONSTRAINT "FK_22a35d6fd3bd1da64cb0752cbb3" FOREIGN KEY ("didDocId") REFERENCES "did_document_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction_entity"
            ADD CONSTRAINT "FK_5e96363fa922f4da9b2b0475477" FOREIGN KEY ("vpRequestChallenge") REFERENCES "vp_request_entity"("challenge") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction_entity"
            ADD CONSTRAINT "FK_459beced792faed537ed4811ba8" FOREIGN KEY ("presentationReviewPresentationReviewId") REFERENCES "presentation_review_entity"("presentationReviewId") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction_entity"
            ADD CONSTRAINT "FK_e7ce43da4087c1785294a7fc75d" FOREIGN KEY ("presentationSubmissionId") REFERENCES "presentation_submission_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_e7ce43da4087c1785294a7fc75d"
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_459beced792faed537ed4811ba8"
        `);
    await queryRunner.query(`
            ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_5e96363fa922f4da9b2b0475477"
        `);
    await queryRunner.query(`
            ALTER TABLE "verification_method_entity" DROP CONSTRAINT "FK_22a35d6fd3bd1da64cb0752cbb3"
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
            DROP TABLE "key_pair"
        `);
    await queryRunner.query(`
            DROP TABLE "did_document_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "verification_method_entity"
        `);
  }
}

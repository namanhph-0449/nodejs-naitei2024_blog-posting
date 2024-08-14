import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1723539162406 implements MigrationInterface {
    name = 'InitialMigration1723539162406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_383f47c98d6fc3e18786e00ed41\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP FOREIGN KEY \`FK_519ba602439f8307957c2dd4287\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP FOREIGN KEY \`FK_ce4d1992337c8dc5e9d7173a2cd\``);
        await queryRunner.query(`DROP INDEX \`IDX_519ba602439f8307957c2dd428\` ON \`subscribe\``);
        await queryRunner.query(`DROP INDEX \`IDX_ce4d1992337c8dc5e9d7173a2c\` ON \`subscribe\``);
        await queryRunner.query(`ALTER TABLE \`post\` CHANGE \`userUserId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP COLUMN \`expireAt\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD \`expireAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`CREATE INDEX \`IDX_ce4d1992337c8dc5e9d7173a2c\` ON \`subscribe\` (\`subscriberId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_519ba602439f8307957c2dd428\` ON \`subscribe\` (\`subscribedId\`)`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_5c1cf55c308037b5aca1038a131\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD CONSTRAINT \`FK_ce4d1992337c8dc5e9d7173a2cd\` FOREIGN KEY (\`subscriberId\`) REFERENCES \`user\`(\`userId\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD CONSTRAINT \`FK_519ba602439f8307957c2dd4287\` FOREIGN KEY (\`subscribedId\`) REFERENCES \`user\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP FOREIGN KEY \`FK_519ba602439f8307957c2dd4287\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP FOREIGN KEY \`FK_ce4d1992337c8dc5e9d7173a2cd\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_5c1cf55c308037b5aca1038a131\``);
        await queryRunner.query(`DROP INDEX \`IDX_519ba602439f8307957c2dd428\` ON \`subscribe\``);
        await queryRunner.query(`DROP INDEX \`IDX_ce4d1992337c8dc5e9d7173a2c\` ON \`subscribe\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP COLUMN \`expireAt\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD \`expireAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`post\` CHANGE \`userId\` \`userUserId\` int NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_ce4d1992337c8dc5e9d7173a2c\` ON \`subscribe\` (\`subscriberId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_519ba602439f8307957c2dd428\` ON \`subscribe\` (\`subscribedId\`)`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD CONSTRAINT \`FK_ce4d1992337c8dc5e9d7173a2cd\` FOREIGN KEY (\`subscriberId\`) REFERENCES \`user\`(\`userId\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD CONSTRAINT \`FK_519ba602439f8307957c2dd4287\` FOREIGN KEY (\`subscribedId\`) REFERENCES \`user\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_383f47c98d6fc3e18786e00ed41\` FOREIGN KEY (\`userUserId\`) REFERENCES \`user\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

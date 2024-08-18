import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1724043739690 implements MigrationInterface {
    name = 'InitialMigration1724043739690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`action\` DROP FOREIGN KEY \`FK_127905b28a03129fb41a7610aa6\``);
        await queryRunner.query(`ALTER TABLE \`action\` DROP FOREIGN KEY \`FK_8ab4f992cd70466d00c5ffadc28\``);
        await queryRunner.query(`DROP INDEX \`IDX_519ba602439f8307957c2dd428\` ON \`subscribe\``);
        await queryRunner.query(`DROP INDEX \`IDX_ce4d1992337c8dc5e9d7173a2c\` ON \`subscribe\``);
        // join Action to User, Post by ID
        await queryRunner.query(`ALTER TABLE \`action\` DROP COLUMN \`postPostId\``);
        await queryRunner.query(`ALTER TABLE \`action\` DROP COLUMN \`userUserId\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP COLUMN \`expireAt\``);
        await queryRunner.query(`ALTER TABLE \`action\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`action\` ADD \`postId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD \`expireAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`CREATE INDEX \`IDX_ce4d1992337c8dc5e9d7173a2c\` ON \`subscribe\` (\`subscriberId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_519ba602439f8307957c2dd428\` ON \`subscribe\` (\`subscribedId\`)`);
        await queryRunner.query(`ALTER TABLE \`post_stats\` ADD CONSTRAINT \`FK_e1f90a53841fc940b2b0d5c9125\` FOREIGN KEY (\`id\`) REFERENCES \`post\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`action\` ADD CONSTRAINT \`FK_b2e3f7568dafa9e86ae03910111\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`action\` ADD CONSTRAINT \`FK_16cfeec11dd706d4c830f048a10\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`postId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD CONSTRAINT \`FK_ce4d1992337c8dc5e9d7173a2cd\` FOREIGN KEY (\`subscriberId\`) REFERENCES \`user\`(\`userId\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD CONSTRAINT \`FK_519ba602439f8307957c2dd4287\` FOREIGN KEY (\`subscribedId\`) REFERENCES \`user\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP FOREIGN KEY \`FK_519ba602439f8307957c2dd4287\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP FOREIGN KEY \`FK_ce4d1992337c8dc5e9d7173a2cd\``);
        await queryRunner.query(`ALTER TABLE \`action\` DROP FOREIGN KEY \`FK_16cfeec11dd706d4c830f048a10\``);
        await queryRunner.query(`ALTER TABLE \`action\` DROP FOREIGN KEY \`FK_b2e3f7568dafa9e86ae03910111\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_9b3ab408235ba7d60345a84f994\``);
        await queryRunner.query(`DROP INDEX \`IDX_519ba602439f8307957c2dd428\` ON \`subscribe\``);
        await queryRunner.query(`DROP INDEX \`IDX_ce4d1992337c8dc5e9d7173a2c\` ON \`subscribe\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP COLUMN \`expireAt\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`action\` DROP COLUMN \`postId\``);
        await queryRunner.query(`ALTER TABLE \`action\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD \`expireAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`action\` ADD \`userUserId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`action\` ADD \`postPostId\` int NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_ce4d1992337c8dc5e9d7173a2c\` ON \`subscribe\` (\`subscriberId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_519ba602439f8307957c2dd428\` ON \`subscribe\` (\`subscribedId\`)`);
        await queryRunner.query(`ALTER TABLE \`action\` ADD CONSTRAINT \`FK_8ab4f992cd70466d00c5ffadc28\` FOREIGN KEY (\`postPostId\`) REFERENCES \`post\`(\`postId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`action\` ADD CONSTRAINT \`FK_127905b28a03129fb41a7610aa6\` FOREIGN KEY (\`userUserId\`) REFERENCES \`user\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

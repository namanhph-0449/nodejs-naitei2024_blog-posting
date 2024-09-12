import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1724824734123 implements MigrationInterface {
    name = 'InitialMigration1724824734123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_1a0a9c69d17cfb196d090858bc8\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_58c08bd38052e10706d3b4ae89a\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_73aac6035a70c5f0313c939f237\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP FOREIGN KEY \`FK_519ba602439f8307957c2dd4287\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP FOREIGN KEY \`FK_ce4d1992337c8dc5e9d7173a2cd\``);
        await queryRunner.query(`DROP INDEX \`IDX_519ba602439f8307957c2dd428\` ON \`subscribe\``);
        await queryRunner.query(`DROP INDEX \`IDX_ce4d1992337c8dc5e9d7173a2c\` ON \`subscribe\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`postPostId\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`userUserId\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP COLUMN \`expireAt\``);
        await queryRunner.query(`ALTER TABLE \`post_tags_tag\` RENAME COLUMN \`postPostId\` TO \`postId\``);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`postId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD \`expireAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`CREATE INDEX \`IDX_ce4d1992337c8dc5e9d7173a2c\` ON \`subscribe\` (\`subscriberId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_519ba602439f8307957c2dd428\` ON \`subscribe\` (\`subscribedId\`)`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_c0354a9a009d3bb45a08655ce3b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_94a85bb16d24033a2afdd5df060\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_73aac6035a70c5f0313c939f237\` FOREIGN KEY (\`parentCommentId\`) REFERENCES \`comment\`(\`commentId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD CONSTRAINT \`FK_ce4d1992337c8dc5e9d7173a2cd\` FOREIGN KEY (\`subscriberId\`) REFERENCES \`user\`(\`userId\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD CONSTRAINT \`FK_519ba602439f8307957c2dd4287\` FOREIGN KEY (\`subscribedId\`) REFERENCES \`user\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP FOREIGN KEY \`FK_519ba602439f8307957c2dd4287\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP FOREIGN KEY \`FK_ce4d1992337c8dc5e9d7173a2cd\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_73aac6035a70c5f0313c939f237\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_94a85bb16d24033a2afdd5df060\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_c0354a9a009d3bb45a08655ce3b\``);
        await queryRunner.query(`DROP INDEX \`IDX_519ba602439f8307957c2dd428\` ON \`subscribe\``);
        await queryRunner.query(`DROP INDEX \`IDX_ce4d1992337c8dc5e9d7173a2c\` ON \`subscribe\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP COLUMN \`expireAt\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`postId\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`post_tags_tag\` RENAME COLUMN \`postId\` TO \`postPostId\``);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD \`expireAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`userUserId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`postPostId\` int NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_ce4d1992337c8dc5e9d7173a2c\` ON \`subscribe\` (\`subscriberId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_519ba602439f8307957c2dd428\` ON \`subscribe\` (\`subscribedId\`)`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD CONSTRAINT \`FK_ce4d1992337c8dc5e9d7173a2cd\` FOREIGN KEY (\`subscriberId\`) REFERENCES \`user\`(\`userId\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`subscribe\` ADD CONSTRAINT \`FK_519ba602439f8307957c2dd4287\` FOREIGN KEY (\`subscribedId\`) REFERENCES \`user\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_73aac6035a70c5f0313c939f237\` FOREIGN KEY (\`parentCommentId\`) REFERENCES \`comment\`(\`commentId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_58c08bd38052e10706d3b4ae89a\` FOREIGN KEY (\`postPostId\`) REFERENCES \`post\`(\`postId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_1a0a9c69d17cfb196d090858bc8\` FOREIGN KEY (\`userUserId\`) REFERENCES \`user\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

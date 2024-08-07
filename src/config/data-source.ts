import { DataSource } from 'typeorm'
import { join } from 'path'
import { config } from 'dotenv'
config();

const host = process.env.DB_HOST || 'localhost'
const port = parseInt(process.env.DB_PORT || '3306', 10);
const username = process.env.DB_USERNAME || 'root'
const password = process.env.DB_PASSWORD || '123456';
const database = process.env.DB_NAME || 'express_locallibrary'

export const AppDataSource = new DataSource ({
    type: 'mysql',
    host: host,
    port: port,
    username:  username,
    password: password,
    database: database,
    logging: false,
    migrations: [join(__dirname, '../migrations/*.{ts, js}' )],
    entities: [join(__dirname, '../entities/*.entity.{ts, js}' )],
    synchronize: false
})

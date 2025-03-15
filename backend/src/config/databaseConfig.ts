import { DatabaseConfig } from '../types';
import { Dialect } from 'sequelize';

const databaseConfig: DatabaseConfig = {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'database',
    host: process.env.DB_HOST || 'localhost',
    dialect: (process.env.DB_DIALECT as Dialect) || 'mysql',
};

export default databaseConfig;
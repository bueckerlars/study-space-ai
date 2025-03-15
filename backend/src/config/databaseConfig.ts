import { DatabaseConfig } from '../types';
import { Dialect } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const databaseConfig: DatabaseConfig = {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'database',
    host: process.env.DB_HOST || 'localhost',
    dialect: (process.env.DB_DIALECT as Dialect) || 'postgres',
};

export default databaseConfig;
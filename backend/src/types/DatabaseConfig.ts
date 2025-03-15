import { Dialect } from 'sequelize';

export interface DatabaseConfig {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: Dialect;
}
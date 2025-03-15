import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export interface ServerConfig {
    port: number;
    environment: 'debug' | 'production';
    host: string;
    logLevel: 'info' | 'warn' | 'error';
    jwtSecret: string;
}

const serverConfig: ServerConfig = {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'debug',
    host: process.env.HOST || 'localhost',
    logLevel: process.env.LOG_LEVEL as 'info' | 'warn' | 'error' || 'info',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
};

export default serverConfig;
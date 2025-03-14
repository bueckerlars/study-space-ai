import Server from './server';
import logger from './services/logger';

const server = new Server();

server.start();
logger.info('Server initialization completed');

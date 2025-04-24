import swaggerJsdoc from 'swagger-jsdoc';
import serverConfig from '../config/serverConfig';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Study Space API',
      version: '1.0.0',
      description: 'API documentation for Study Space application',
    },
    servers: [
      {
        url: `http://${serverConfig.host}:${serverConfig.port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  // Use glob patterns that work in both development and production
  apis: [
    './dist/routes/*.js',
    './dist/app.js',
    './dist/server.js',
    './src/routes/*.ts',
    './src/app.ts',
    './src/server.ts'
  ],
};

const specs = swaggerJsdoc(options);

export default specs;

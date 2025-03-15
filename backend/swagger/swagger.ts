import swaggerJsdoc from 'swagger-jsdoc';
import serverConfig from '../src/config/serverConfig';

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
  // Path patterns to find your JSDoc comments that contain your OpenAPI annotations
  apis: ['./src/routes/*.ts', './src/app.ts', './src/server.ts'],
};

const specs = swaggerJsdoc(options);

export default specs;

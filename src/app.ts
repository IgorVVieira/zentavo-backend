import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import 'dotenv/config';
import 'express-async-errors';
import 'module-alias/register';
import 'reflect-metadata';
import {
  createExpressServer,
  getMetadataArgsStorage,
  RoutingControllersOptions,
  useContainer,
} from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';

import { HttpStatus } from '@shared/http-status.enum';
import { authMiddleware } from '@shared/middlewares/auth';
import { errorHandler } from '@shared/middlewares/error-handler';

import '@transactions/infra/container';
import '@users/infra/container';
import { TsyringeAdapter } from './tsyringe-adapter';
import { startConsumers } from './workers';

useContainer(TsyringeAdapter);

const routeOptions: RoutingControllersOptions = {
  routePrefix: '/api',
  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  },
  defaults: {
    nullResultCode: HttpStatus.NOT_FOUND,
    undefinedResultCode: HttpStatus.NOT_FOUND,
    paramOptions: {
      required: true,
    },
  },
  validation: {
    forbidUnknownValues: true,
    whitelist: true,
  },
  defaultErrorHandler: false,
  classTransformer: true,
  authorizationChecker: async action => {
    try {
      await new Promise((resolve, reject) => {
        authMiddleware(action.request, action.response, err => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      });

      return true;
    } catch {
      return false;
    }
  },
  currentUserChecker: async action => action.request.userId,
  controllers: [__dirname + '/**/*.controller.{ts,js}'],
  middlewares: [__dirname + '/shared/middlewares/*.{ts,js}'],
};

const app = createExpressServer(routeOptions);

app.use(errorHandler);

try {
  const storage = getMetadataArgsStorage();
  const schemas = validationMetadatasToSchemas();
  const spec = routingControllersToSpec(storage, routeOptions, {
    components: {
      schemas,
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    info: {
      title: 'Zentavo API Documentation',
      version: '1.0.0',
      description: 'API Documentation for Zentavo a financial management system',
    },
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
} catch (error) {
  console.error('Error generating Swagger documentation:', error);
}

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

startConsumers()
  .then(() => {
    console.log('Consumers started');
  })
  .catch(console.error);

export { app };

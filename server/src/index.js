// TODO: Create new dynamic Validation Layer for all routes
// TODO: Better Error Handling with Express - that all is wired for nested async with pipeline
'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('env-var');
const morgan = require('morgan');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

require('dotenv').config();

const errorHandler = require('./middleware/error-handler');

const logger = require('./utils/logger');
const { NotFoundError } = require('./utils/errors');
const { connectDb } = require('./utils/connect-db');

const { authRoute } = require('./routes/auth-route');
const { documentRoute } = require('./routes/document-route');
const { healthCheckRoute } = require('./routes/healthCheck-route');
const { dummySeedRoute } = require('./routes/dummySeed-route');
const { favoriteVideoRoute } = require('./routes/favoriteVideo-route');
const { topicRoute } = require('./routes/topic-route');
const { userRoute } = require('./routes/user-route');
const { videoRoute } = require('./routes/video-route');

connectDb();

const app = express();

const port = env.get('PORT').required().asString();

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'Video Library API',
      description: 'Video Library semestral project API',
      servers: [`localhost:${env.get('PORT').required().asString()}`],
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          in: 'header',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        jwt: [],
      },
    ],
  },
  apis: [`${__dirname}/routes/*.js`],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * Set express configs
 */
app.use(helmet());

// Add a list of allowed origins.
const allowedOrigins = env.get('ALLOWED_ORIGINS').required().asArray();
const options = {
  origin: allowedOrigins,
};

// Then pass these options to cors:
app.use(cors(options));
app.use(morgan('combined'));
app.set('trust proxy', true);
app.use(express.urlencoded({ extended: true }));
// Limit for files
app.use(
  express.json({
    limit: '100mb',
  }),
);

// Secure -> disable detect express
app.disable('x-powered-by');

const rootRouter = express.Router();

// Use routes
rootRouter.use(authRoute);
rootRouter.use(documentRoute);
rootRouter.use(dummySeedRoute);
rootRouter.use(favoriteVideoRoute);
rootRouter.use(healthCheckRoute);
rootRouter.use(topicRoute);
rootRouter.use(userRoute);
rootRouter.use(videoRoute);

app.use('/api/', rootRouter);

// Run only one Express instance at the same port
process.once('SIGUSR2', function () {
  process.kill(process.pid, 'SIGUSR2');
});

// Global error handling
app.all('*', async (req, res, next) => {
  const error = new NotFoundError(`Route doesn't find`);
  logger.error('Global error handling: ', error);
  next(error);
});

app.use(errorHandler);

app
  .listen(port, () => {
    logger.info(`Server 🚀 started on port ${port}`);
  })
  .on('error', (error) => {
    logger.error('An [error] has occurred. error is: %s and stack trace is: %s', error, error.stack);
  });

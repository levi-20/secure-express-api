import express from 'express'

import { healthRouter } from '@/health/health.route.js';
import { requestIdMiddleware } from '@/request-id.middleware.js';
import { notFoundMiddleware } from '@/not-found.middleware.js';
import { errorHandlerMiddleware } from '@/error-handler.middleware.js';

const app: express.Application = express();

app.use(express.json({
  limit: '1mb'
}));

// Middlewares
app.use(requestIdMiddleware);

// Routes
app.use('/health', healthRouter);

// For 404 routes
app.use(notFoundMiddleware)

// Error hander
app.use(errorHandlerMiddleware)

export default app
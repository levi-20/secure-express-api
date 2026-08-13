import express from 'express'

import { healthRouter } from '@/health/health.route.js';
import { requestIdMiddleware } from '@/request.id.middleware.js';

const app: express.Application = express();
app.use(express.json({
  limit: '1mb'
}));

// Middlewares
app.use(requestIdMiddleware);

// Routes
app.use('/health', healthRouter);


export default app
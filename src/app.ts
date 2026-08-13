import express from 'express'

import { healthRouter } from '@/health/health.route.js';

const app: express.Application = express();
app.use(express.json());

// Middlewares

// Routes
app.use('/health', healthRouter);


export default app
import { Ajv } from 'ajv';
import ajvErrors from "ajv-errors";
import { Router } from 'express'

import { createUserController, getAccessTokenController, getCsrfTokenController, getCurrentUserConntroller, getUserController, loginUserController, logoutController, refreshTokenController } from './user.controller.js';
import { createUserSchema, loginUserSchema } from '@/schema/user.js';
import { validateRequestBody } from '@/schema-validator.meddleware.js';
import { authenticateCookeiMiddleware, authenticateJwtTokenMiddleware, authenticateRefreshTokenMiddleware } from '@/auth.middleware.js';
import { verifyCsrf } from '@/csrf.middleware.js';

const ajv = new Ajv({ allErrors: true });

// @ts-ignore
ajvErrors(ajv)

const validateNewUser = ajv.compile(createUserSchema)
const validateLogin = ajv.compile(loginUserSchema)

export const userRouter: Router = Router();

userRouter.get('/me', authenticateCookeiMiddleware, getCurrentUserConntroller)
userRouter.get('/csrf', authenticateCookeiMiddleware, getCsrfTokenController)

userRouter.post('/login', validateRequestBody(validateLogin), loginUserController)
userRouter.post('/logout', authenticateCookeiMiddleware, verifyCsrf, logoutController)
userRouter.post('/register', validateRequestBody(validateNewUser), createUserController)
userRouter.post('/token', validateRequestBody(validateLogin), getAccessTokenController)
userRouter.post('/refresh', authenticateRefreshTokenMiddleware, refreshTokenController)
userRouter.post('/self', authenticateJwtTokenMiddleware, getCurrentUserConntroller)

userRouter.get('/users/:email', authenticateCookeiMiddleware, getUserController)

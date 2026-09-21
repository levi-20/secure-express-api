import { Ajv } from 'ajv';
import ajvErrors from "ajv-errors";
import { Router } from 'express'

import { createUserController, getAccessTokenController, getCsrfTokenController, getCurrentUserController, getUserController, loginUserController, logoutController, refreshTokenController } from './user.controller.js';
import { createUserSchema, loginUserSchema } from '@/schema/user.js';
import { validateRequestBody } from '@/schema-validator.middleware.js';
import { authenticateCookieMiddleware, authenticateJwtTokenMiddleware, authenticateRefreshTokenMiddleware } from '@/auth.middleware.js';
import { verifyCsrf } from '@/csrf.middleware.js';

const ajv = new Ajv({ allErrors: true });

// @ts-ignore
ajvErrors(ajv)

const validateNewUser = ajv.compile(createUserSchema)
const validateLogin = ajv.compile(loginUserSchema)

export const userRouter: Router = Router();

userRouter.get('/me', authenticateCookieMiddleware, getCurrentUserController)
userRouter.get('/csrf', authenticateCookieMiddleware, getCsrfTokenController)

userRouter.post('/login', validateRequestBody(validateLogin), loginUserController)
userRouter.post('/logout', authenticateCookieMiddleware, verifyCsrf, logoutController)
userRouter.post('/register', validateRequestBody(validateNewUser), createUserController)
userRouter.post('/token', validateRequestBody(validateLogin), getAccessTokenController)
userRouter.post('/refresh', authenticateRefreshTokenMiddleware, refreshTokenController)
userRouter.post('/self', authenticateJwtTokenMiddleware, getCurrentUserController)

userRouter.get('/users/:email', authenticateCookieMiddleware, getUserController)

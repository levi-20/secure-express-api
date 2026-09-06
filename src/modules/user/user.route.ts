import { Router } from 'express'
import { Ajv } from 'ajv';
import ajvErrors from "ajv-errors";

import { createUserController, getAccessTokenController, getCsrfTokenController, getCurrentUserConntroller, getUserController, loginUserController, logoutController } from './user.controller.js';
import { createUserSchema, loginUserSchema } from '@/schema/user.js';
import { validateRequestBody } from '@/schema-validator.meddleware.js';
import { authenticate, authenticateToken } from '@/auth.middleware.js';
import { verifyCsrf } from '@/csrf.middleware.js';

const ajv = new Ajv({ allErrors: true });

// @ts-ignore
ajvErrors(ajv)

const validateNewUser = ajv.compile(createUserSchema)
const validateLogin = ajv.compile(loginUserSchema)

export const userRouter: Router = Router();

userRouter.get('/me', authenticate, getCurrentUserConntroller)
userRouter.get('/csrf', authenticate, getCsrfTokenController)

userRouter.post('/login', validateRequestBody(validateLogin), loginUserController)
userRouter.post('/logout', authenticate, verifyCsrf, logoutController)
userRouter.post('/register', validateRequestBody(validateNewUser), createUserController)
userRouter.post('/token', validateRequestBody(validateLogin), getAccessTokenController)
userRouter.post('/self', authenticateToken, getCurrentUserConntroller)

userRouter.get('/users/:email', authenticate, getUserController)

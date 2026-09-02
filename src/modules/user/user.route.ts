import { Router } from 'express'
import { Ajv } from 'ajv';
import ajvErrors from "ajv-errors";


import { createUserController, getUserController, loginUserController } from './user.controller.js';
import { createUserSchema, loginUserSchema } from '@/schema/user.js';
import { validateRequestBody } from '@/schema-validator.meddleware.js';

const ajv = new Ajv({ allErrors: true });

// @ts-ignore
ajvErrors(ajv)

const validateNewUser = ajv.compile(createUserSchema)
const validateLogin = ajv.compile(loginUserSchema)

export const userRouter: Router = Router();

userRouter.get('/:email', getUserController)
userRouter.post('/', validateRequestBody(validateNewUser), createUserController)
userRouter.post('/login', validateRequestBody(validateLogin), loginUserController)
import { Router } from 'express'
import { Ajv } from 'ajv';
import ajvErrors from "ajv-errors";


import { createUserController, getUserController } from './user.controller.js';
import { createUserSchema } from '@/schema/user.js';
import { validateRequestBody } from '@/schema-validator.meddleware.js';

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv)

const validateNewUser = ajv.compile(createUserSchema)

export const userRouter: Router = Router();

userRouter.get('/:email', getUserController)
userRouter.post('/', validateRequestBody(validateNewUser), createUserController)
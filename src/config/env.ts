import * as z from 'zod/mini'

const envSchema = z.object({
  NODE_ENV: z._default(
    z.enum(["development", "test", "production"]),
    'development'
  ),
  PORT: z.coerce.number().check(
    z.int(),
    z.positive(),
    z.maximum(65535),
  ),
});

export const env = envSchema.parse(process.env);
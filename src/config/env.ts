import * as z from 'zod'

const envSchema = z.object({

  NODE_ENV: z.enum(["development", "test", "production"]).default('development'),

  PORT: z.coerce.number().int().positive().max(65535),

  POSTGRES_HOST: z.hostname().or(z.ipv4()),

  POSTGRES_USER: z.string().min(1),

  POSTGRES_PASSWORD: z.string().min(1),

  POSTGRES_DB: z.string().min(1)
});

const env = envSchema.parse(process.env);

export default env;
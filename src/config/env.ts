import * as z from 'zod'


const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default('dev'),
  PORT: z.coerce.number().int().positive(),
});

export const env = envSchema.parse(process.env);
import { en } from "zod/locales";
import env from "./env.js"

export type Environment =
  | "development"
  | "test"
  | "production";

type AppConfig = {
  environment: Environment
  server: {
    port: number,
  },
  database: {
    url: string,
    pool: {
      max: number,
      idleTimeoutMillis: number,
      connectionTimeoutMillis: number,
    }
  },
  auth: {
    sessionTTL: number,
    csrf: string,
    jwtSecret: string,
    jwtTTL: number
  }
}


const config: AppConfig = {
  auth: {
    sessionTTL: env.SESSION_TTL_DAYS * 24 * 60 * 60 * 1_000,
    csrf: env.CSRF_SECRET,
    jwtSecret: env.JWT_SECRET,
    jwtTTL: env.JWT_TTL_MINUTES * 60
  },
  environment: env.NODE_ENV as Environment,
  database: {
    url: `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:5432/${env.POSTGRES_DB}?sslmode=disable`,
    pool: {
      max: env.POOL_MAX,
      idleTimeoutMillis: env.POOL_IDLE_TIMEOUT,
      connectionTimeoutMillis: env.POOL_CONNECTION_TIMEOUT,
    },
  },
  server: {
    port: env.PORT,
  },
}

export default config;

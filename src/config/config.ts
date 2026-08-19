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
      max: number;
      idleTimeoutMillis: number;
      connectionTimeoutMillis: number;
    };
  }
}


const config: AppConfig = {
  environment: env.NODE_ENV as Environment,
  server: {
    port: env.PORT,
  },
  database: {
    url: `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:5432/${env.POSTGRES_DB}?sslmode=disable`,
    pool: {
      max: env.POOL_MAX,
      idleTimeoutMillis: env.POOL_IDLE_TIMEOUT,
      connectionTimeoutMillis: env.POOL_CONNECTION_TIMEOUT,
    },
  },
}

export default config;
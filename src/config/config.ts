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
    url: string
  }
}


const config: AppConfig = {
  environment: env.NODE_ENV as Environment,
  server: {
    port: env.PORT,
  },
  database: {
    url: `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:5432/${env.POSTGRES_DB}?sslmode=disable`
  }
}

export default config;
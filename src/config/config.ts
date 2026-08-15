import { env } from "./env.js"

type Environment = "dev" | "test" | "production"

type AppConfig =  {
  environment: Environment
  server: {
    port: number,
  }
}


export const config: AppConfig = {
  environment: env.NODE_ENV,
  server: {
    port: env.PORT,
  }
}
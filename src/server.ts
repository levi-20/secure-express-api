import config from '@/config.js';
import app from "./app.js";
import { pool } from './infra/db/client.js';


const server = app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});

const shutdown = async (signal: string) => {
  
  console.log(`${signal} recieved, Shutting down gracefully`)

  server.close(async () => {
    await pool.end()
    console.log("db pool closed")
    process.exit(0)
  })
}

process.on("SIGTERM", () => shutdown("SIGTERM"))

process.on("SIGINT", () => shutdown("SIGINT"))
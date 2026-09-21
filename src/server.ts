import config from '@/config.js';
import app from "./app.js";
import { pool } from './infra/db/client.js';
import { initializeCronJobs, shutdownCronJobs } from '@/cron/cron.js';


const server = app.listen(config.server.port, () => {

  console.log(`[Server] Server running on port ${config.server.port}...`);

  initializeCronJobs()
});

const shutdown = async (signal: string) => {

  console.log(`🛑 [Server] "${signal}" signal received, Shutting down...`)

  await shutdownCronJobs(signal);

  server.close(async () => {

    await pool.end()
    console.log("🛑 [Server] Closed db pool!")

    console.log(`🛑 [Server] Shutdown complete!`)
    process.exit(0)
  })
}

process.on("SIGTERM", () => shutdown("SIGTERM"))

process.on("SIGINT", () => shutdown("SIGINT"))

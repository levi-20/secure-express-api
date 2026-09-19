import { cleanExpiredSessions } from "@/auth/session.repository.js";
import { cleanExpiredTokens } from "@/auth/token.repository.js";

export const tokenCleanupJob = async () => {

  console.info("[ExpiredTokens] Staring expired token cleanup");

  try {
    const rowsAffected = await cleanExpiredTokens();
    console.info(`[ExpiredTokens] Cleaned ${rowsAffected} rows.`)
    console.info("[ExpiredTokens] Job finished, will repeat next hour.");
  } catch (err) {
    console.error("[ExpiredTokens] Cleanup failed; will retry on next scheduled run.", err)
  }
}


export const sessionCleanupJob = async () => {

  console.info("[ExpiredSessions] Staring expired session cleanup");

  try {
    const rowsAffected = await cleanExpiredSessions();
    console.info(`[ExpiredSessions] Cleaned ${rowsAffected} rows.`)
    console.info("[ExpiredSessions] Job finished, will repeat next hour.");

  } catch (err) {
    console.error("[ExpiredSessions] Cleanup failed; will retry on next scheduled run.", err)
  }
}

import { setTimeout, clearTimeout } from "node:timers";
import { tokenCleanupJob, sessionCleanupJob } from "./jobs.js";


let activeTimeoutId: NodeJS.Timeout;
let isJobRunning: boolean = false;
let isShuttingDown: boolean = false;


const calculateDelay = (period: string): number => {

  const time = new Date();
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()
  const milliseconds = time.getMilliseconds()

  const match = period.match(/^(\d+)([mh])$/);
  if (!match)
    return (60 * 1_000) - (seconds * 1_000) - milliseconds

  const timer = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case 'm': {
      const interval = timer * 60 * 1_000;
      const intervalPosition = (minutes % timer) * 60 * 1_000 + seconds * 1_000 + milliseconds;
      return interval - intervalPosition;
    }
    case 'h': {
      const interval = timer * 60 * 60 * 1_000;
      const hours = time.getHours();
      const intervalPosition = (hours % timer) * 60 * 60 * 1_000 + minutes * 60 * 1_000 + seconds * 1_000 + milliseconds;
      return interval - intervalPosition;
    }
    default:
      return (60 * 1_000) - (seconds * 1_000) - milliseconds
  }
}

export const scheduleCronJobs = async (period: string) => {

  if (isShuttingDown) return;

  const delay = calculateDelay(period)

  activeTimeoutId = setTimeout(async () => {
    try {
      console.log("[Scheduler] starting executing clean up jobs");
      isJobRunning = true;
      await tokenCleanupJob()
      await sessionCleanupJob()

    } catch (err) {
      console.log("[Scheduler] error in cleanup jobs schedule", err)
    } finally {
      isJobRunning = false;
    }

    scheduleCronJobs(period);

  }, delay)
}

export const initializeCronJobs = (period?: string) => {

  console.log("[Scheduler] Scheduling cron jobs....")

  if (!period) {
    console.warn("[Scheduler] schedule period not provided, scheduling with default period: '1h'")
    period = '1m'
  }

  const match = period.match(/^(\d+)([mh])$/);
  if (!match) {
    console.warn("[Scheduler] schedule period didn't match regex scheduling with default period: '1h'")
    period = '1m'
  }

  scheduleCronJobs(period)
}

export const shutdownCronJobs = async (signal: string) => {

  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`🛑 [Scheduler] Received ${signal}. Stopping timers...`);

  if (activeTimeoutId) {
    clearTimeout(activeTimeoutId);
    console.log("🛑 [Scheduler] Cancelled the next scheduled hour's timer.");
  }

  if (isJobRunning) {
    console.log("[Scheduler] Waiting for active jobs to finish running safely...");

    while (isJobRunning) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("[Scheduler] Active jobs completed.");
  }
  console.log("🛑 [Scheduler] Background processes closed cleanly.");
};

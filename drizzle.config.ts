import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/infra/db/*.ts",
  dialect: "postgresql",
  out: "./migrations/db",   // ← destination folder for generated migrations
});
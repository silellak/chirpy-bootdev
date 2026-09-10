import { MigrationConfig } from "drizzle-orm/xata-http/migrator";

process.loadEnvFile()

export type APIConfig = {
  fileserverHits: number;
  port: number;
  platform?: string;
};

export type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

export type Config = {
  api: APIConfig;
  db: DBConfig;
}

export const apiConfig: APIConfig = {
  fileserverHits: 0,
  port: parseInt(process.env.PORT || "8080"),
  platform: process.env.PLATFORM || "dev",
};

export const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config : Config = {
  api: apiConfig,
  db: {
    url: process.env.DB_URL || "",
    migrationConfig: migrationConfig,
  },
};

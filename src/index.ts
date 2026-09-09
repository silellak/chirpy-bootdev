import express from "express";
import { middlewareLogResponses } from "./middleware/logging.js";
import { middlewareMetricsInc } from "./middleware/metrics.js";
import { handlerReadiness, handlerRequestCount, handlerResetMetrics, handlerValidateChirp } from "./handlers/handlers.js";
import { middlewareHandleError } from "./middleware/errors.js";
import postgres from "postgres";
import { config } from "./config.js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = config.api.port;

app.use(express.json());
app.use("/app", middlewareMetricsInc);
app.use(middlewareLogResponses);
app.use("/app", express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerRequestCount);
app.post("/admin/reset", handlerResetMetrics);
app.post('/api/validate_chirp', handlerValidateChirp);

app.use(middlewareHandleError);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
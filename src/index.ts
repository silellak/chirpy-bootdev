import express from "express";
import { middlewareLogResponses } from "./middleware/logging.js";
import { middlewareMetricsInc } from "./middleware/metrics.js";
import { handlerReadiness, handlerRequestCount, handlerResetMetrics } from "./handlers/handlers.js";

const app = express();
const PORT = 8080;

app.use("/app", middlewareMetricsInc);
app.use(middlewareLogResponses);
app.use("/app", express.static("./src/app"));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerRequestCount);
app.get("/admin/reset", handlerResetMetrics);
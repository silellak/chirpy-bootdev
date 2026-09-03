import express from "express";
import { middlewareLogResponses } from "./middleware/logging.js";

const app = express();
const PORT = 8080;

app.use("/app", express.static("./src/app"));

function handlerReadiness(_req: express.Request, res: express.Response) {
  res.status(200).type("text/plain").send("OK");
}

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.get("/healthz", handlerReadiness);
app.use(middlewareLogResponses);
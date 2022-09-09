import "dotenv/config";
import { Request, Response } from "express";

import { dbConfig } from "./configs/db.config";
import createServer from "./services/express.service";

const PORT = Number(process.env.OTOT_B_MONGO_PORT) ?? 8080;

const app = createServer();

app.listen(PORT, () => {
  console.log(`[server] is running on http://localhost:${PORT}`);
});

import "dotenv/config";
import BodyParser from "body-parser";
import express, { Request, Response } from "express";

import router from "./routes/contact.route";
import { dbConfig } from "./configs/db.config";

const PORT = Number(process.env.OTOT_B_MONGO_PORT) ?? 8080;

const app = express();
app.use(
  BodyParser.urlencoded({
    extended: true,
  })
);
app.use(BodyParser.json());

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.json({
    msg: "Hello from default Express!",
    config: dbConfig.source,
  });
});

app.listen(PORT, () => {
  console.log(`[server] is running on localhost:${PORT}`);
});

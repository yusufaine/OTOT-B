import "dotenv/config";
import BodyParser from "body-parser";
import express, { Request, Response } from "express";

import router from "./routes";

const PORT = Number(process.env.PORT) ?? 8080;

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
  });
});

app.listen(PORT, () => {
  console.log(`[server] is running on port: ${PORT}`);
});

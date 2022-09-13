import cors from "cors";
import BodyParser from "body-parser";
import express, { Request } from "express";

import routes from "../routes/contact.route";

function createServer() {
  const app = express();
  app.use(
    BodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(BodyParser.json());
  app.use(cors());
  app.options("*", cors());
  routes(app);

  return app;
}

export default createServer;

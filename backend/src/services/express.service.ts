import BodyParser from "body-parser";
import cors from "cors";
import express from "express";

import routes from "../routes/contact.route";

function createServer() {
  const app = express();
  app.use(cors());
  app.use(
    BodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(BodyParser.json());
  routes(app);

  return app;
}

export default createServer;

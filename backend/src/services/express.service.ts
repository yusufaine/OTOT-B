import BodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";

import routes from "../routes/contact.route";

function createServer() {
  const app = express();
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

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

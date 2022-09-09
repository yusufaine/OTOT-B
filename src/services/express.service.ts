import express from "express";
import BodyParser from "body-parser";
import routes from "../routes/contact.route";

function createServer() {
  const app = express();
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

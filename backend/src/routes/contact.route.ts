import { Express, Request, Response } from "express";
import { dbConfig } from "../configs/db.config";

import * as contactController from "../controllers/contact.controller";

function routes(app: Express) {
  app.get("/", (_req: Request, res: Response) => {
    res.json({
      msg: "Hello from default Express!",
      config: dbConfig.source,
    });
  });

  app.get("/api", (_req: Request, res: Response) => {
    res.json({
      message: "API is working",
    });
  });

  app.get("/healthcheck", (_req: Request, res: Response) => {
    res.sendStatus(200).json("Everything's ok!");
  });

  // mongo-related routes

  app
    .route("/api/contacts")
    .get(contactController.index)
    .post(contactController.add);

  app.route("/api/contacts/addRandom").post(contactController.addRandom);

  app
    .route("/api/contacts/addRandom/:count")
    .post(contactController.addMultipleRandom);

  app
    .route("/api/contacts/:contact_id")
    .get(contactController.view)
    .patch(contactController.update)
    .put(contactController.update)
    .delete(contactController.remove);

  app.route("/api/contacts/clear/all").delete(contactController.clearDb);
}

export default routes;

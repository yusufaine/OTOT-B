import { Request, Response, Router } from "express";

import * as contactController from "../controllers/contact.controller";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    status: 200,
    message: "API is working",
  });
});

router.get("/test", (req: Request, res: Response) => {
  res.json({
    status: 200,
    message: "Showing api/test",
  });
});

// mongo-related routes

router
  .route("/contacts")
  .get(contactController.index)
  .post(contactController.add);

router.route("/contacts/addRandom").post(contactController.addRandom);

router
  .route("/contacts/addRandom/:count")
  .post(contactController.addMultipleRandom);

router
  .route("/contacts/:contact_id")
  .get(contactController.view)
  .patch(contactController.update)
  .put(contactController.update)
  .delete(contactController.remove);

router.route("/contacts/clear/all").get(contactController.clearDb);

export default router;

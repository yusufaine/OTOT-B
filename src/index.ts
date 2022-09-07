import "dotenv/config";
import BodyParser from "body-parser";
import express, { Request, Response } from "express";

import router from "./routes";

const PORT = process.env.PORT ?? "8080";
// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   throw new Error("MONGO_URI not found");
// }

// export const mongoClient = new MongoClient(MONGO_URI).connect(
//   (error, result) => {
//     if (error) {
//       console.log(buildErrorJson(error.message));
//     }

//     return result.db(DB_NAME).collection<ContactSchema>(DB_COLLECTION);
//   }
// );
// async () => {
//   if (!MONGO_URI) {
//     throw new Error("MONGO_URI not found");
//   }

//   try {
//     await mongoClient.connect((error, result) => {
//       if (error) {
//         res.json(buildErrorJson(error.message));
//       }
//     });
//   } catch (error) {
//     throw new Error(error as string);
//   }
// };

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

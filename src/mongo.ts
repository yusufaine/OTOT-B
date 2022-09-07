import { MongoClient } from "mongodb";

import { DB_COLLECTION, DB_NAME } from "./utils";
import { ContactSchema } from "./contact.types";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI not found");
}

const mongoClient = new MongoClient(MONGO_URI);
mongoClient.connect((error, result) => {
  if (error) {
    throw new Error(error.message);
  }
});

export const mongoCollection = mongoClient
  .db(DB_NAME)
  .collection<ContactSchema>(DB_COLLECTION);

import { MongoClient } from "mongodb";

import { dbConfig } from "../configs/db.config";
import { ContactSchema } from "../models/contact.models";

if (!dbConfig.uri) {
  throw new Error("MONGO_URI not found");
}

const mongoClient = new MongoClient(dbConfig.uri);
mongoClient.connect((error, result) => {
  if (error) {
    throw new Error(error.message);
  }
});

export const mongoCollection = mongoClient
  .db(dbConfig.dbName)
  .collection<ContactSchema>(dbConfig.dbCollection);

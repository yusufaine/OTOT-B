import { MongoClient } from "mongodb";
import { ContactSchema } from "../models/contact.models";

import { dbConfig } from "../configs/db.config";

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
  .collection<ContactSchemaSchema>(dbConfig.dbCollection);

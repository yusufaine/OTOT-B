export const dbConfig = {
  uri: process.env.MONGO_URI ?? "",
  dbName: "task-b",
  dbCollection: "contacts",
};

export const dbConfig = {
  uri: process.env.OTOT_B_MONGO_URI ?? "",
  dbName: "task-b",
  dbCollection: "contacts",
  source: process.env.OTOT_B_SOURCE ?? "LOCAL DOTENV",
};

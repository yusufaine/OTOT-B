import { Request } from "express";
import { faker } from "@faker-js/faker";

import { ContactSchema } from "./contact.types";

export const DB_NAME = "task-b";
export const DB_COLLECTION = "contacts";

export function createFakeContact(): ContactSchema {
  return {
    email: faker.internet.email(),
    name: faker.name.fullName(),
    gender: Math.random() * 100 < 50 ? "male" : "female",
    phone: faker.phone.number(),
  };
}

export function buildErrorJson(message: string) {
  return {
    status: "error",
    message,
  };
}

export function buildSuccessJson(message: string, data?: any) {
  const json = {
    status: "success",
    message,
  };

  if (data) {
    json["data"] = data;
  }

  return json;
}

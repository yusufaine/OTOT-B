import { faker } from "@faker-js/faker";

import { ContactSchema } from "../models/contact.models";

export function createFakeContact(): ContactSchema {
  return {
    email: faker.internet.email(),
    name: faker.name.fullName(),
    gender: Math.random() * 100 < 50 ? "male" : "female",
    phone: faker.phone.number(),
  };
}

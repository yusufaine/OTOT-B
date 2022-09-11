import { ContactSchema } from "../src/models/contact.models";

export const validContact: ContactSchema = {
  email: "dummy@email.com",
  name: "Dummy User",
  gender: "male",
  phone: "+65 8491 2483",
};

export const invalidContact: Partial<ContactSchema> = {
  email: "dummy@email.com",
  // name: "Valid User",
  gender: "male",
  phone: "+65 8491 2483",
};

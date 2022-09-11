import _ from "lodash";
import request from "supertest";

import createServer from "../src/services/express.service";
import { invalidContact, validContact } from "./test.utils";

const app = createServer();

let contactCount = 0;
let validContactId = "";
let updatedContact = {};

// describe("intentionally invalid test", () => {
//   test("1+1=2", () => {
//     expect(1 + 1).toBe(3);
//   });
// });

describe(`from "/healthcheck`, () => {
  describe("GET", () => {
    test("returns status of Express", async () => {
      const res = await request(app).get("/healthcheck");
      expect(res.statusCode).toBe(200);
    });
  });
});

describe(`from "/contacts"`, () => {
  describe("GET", () => {
    test("get all listed contacts", async () => {
      const res = await request(app).get("/api/contacts");

      expect(res.statusCode).toBe(200);
      contactCount = Number(res.body.data.count);

      if (res.body.message == "no contacts stored") {
        expect(contactCount).toBe(0);
      } else {
        expect(contactCount).toBeGreaterThan(0);
      }
    });
  });
  describe("POST", () => {
    describe("given an invalid contact", () => {
      test("returns error json", async () => {
        const res = await request(app)
          .post("/api/contacts")
          .send(invalidContact);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("email and name has to be specified");
      });
    });
    describe("given a valid contact", () => {
      test("returns success json with the contact data", async () => {
        const res = await request(app).post("/api/contacts").send(validContact);
        validContactId = res.body.data._id;

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("successfully added contact");
        expect(_.omit(res.body.data, "_id")).toEqual(validContact);
      });
    });
  });
});

describe(`from "/contacts/:contact_id`, () => {
  describe("GET", () => {
    describe("given an invalid contact_id length", () => {
      test("returns error json", async () => {
        const invalidContactId = "-1";
        const res = await request(app).get(`/api/contacts/${invalidContactId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("expected hex string of length 24");
      });
      describe("given an invalid contact_id of valid length", () => {
        test("returns error json", async () => {
          const invalidContactId = "------------------------";
          const res = await request(app).get(
            `/api/contacts/${invalidContactId}`
          );
          expect(res.statusCode).toBe(200);
          expect(res.body.message).toBe("expected hex string of length 24");
        });
      });
      describe("given a valid hex string that does not exist in db", () => {
        test("returns json stating id does not exist", async () => {
          const invalidContactId = "0123abcd0123abcd0123abcd";
          const res = await request(app).get(
            `/api/contacts/${invalidContactId}`
          );
          expect(res.statusCode).toBe(200);
          expect(res.body.message).toBe(`${invalidContactId} not found`);
        });
      });
    });
    describe("given a valid contact_id", () => {
      test("return associated contact", async () => {
        const res = await request(app).get(`/api/contacts/${validContactId}`);
        expect(res.statusCode).toBe(200);
        expect(_.omit(res.body.data, "_id")).toEqual(validContact);
      });
    });
  });

  describe("PATCH/PUT", () => {
    describe("skipping invalid contact_id tests", () => {});
    describe("modify single valid field", () => {
      test("returns contact before and after the change", async () => {
        const { gender, ...info } = validContact;
        updatedContact = {
          _id: validContactId,
          ...info,
          gender: "female",
        }; //originally male
        const res = await request(app)
          .patch(`/api/contacts/${validContactId}`)
          .send(updatedContact);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.initial).toEqual({
          _id: validContactId,
          ...validContact,
        });
        expect(res.body.data.updated).toEqual(updatedContact);
      });
    });
  });

  describe("DELETE", () => {
    describe("skipping invalid contact_id", () => {});
    describe("remove valid contact_id", () => {
      test("returns success json with the deleted contact infomation", async () => {
        const res = await request(app).delete(
          `/api/contacts/${validContactId}`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toEqual(updatedContact);
      });
    });
  });
});

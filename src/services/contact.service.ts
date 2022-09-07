import { Request } from "express";
import { Filter, ObjectId, UpdateFilter } from "mongodb";

import { mongoCollection } from "./mongo.service";
import { ContactSchema } from "../models/contact.models";
import { buildErrorJson, buildSuccessJson } from "../utils/json.utils";
import { createFakeContact } from "../utils/faker.utils";

export async function index() {
  try {
    const allContacts = await mongoCollection
      .find({}, { projection: { __v: 0 } })
      .toArray();

    return allContacts.length
      ? buildSuccessJson("contacts retrieved", {
          data: {
            count: allContacts.length,
            contacts: allContacts,
          },
        })
      : buildSuccessJson("contacts is empty");
  } catch (error) {
    return buildErrorJson("unable to get all contacts", error);
  }
}

export async function add(req: Request) {
  if (!(req.body.email && req.body.name)) {
    return buildErrorJson("email and name has to be specified");
  }
  const newContact: ContactSchema = {
    email: req.body.email,
    name: req.body.name,
    gender: req.body.gender,
    phone: req.body.phone,
  };

  const res = await mongoCollection.insertOne(newContact);

  if (!res.acknowledged) {
    return buildErrorJson("unable to add contact", { data: newContact });
  }

  const filter: Filter<ContactSchema> = { _id: res.insertedId };
  const addedContact = await mongoCollection.findOne(filter);

  return buildSuccessJson("successfully added contact", {
    data: { ...addedContact },
  });
}

export async function addRandom() {
  const randomContact = createFakeContact();

  const res = await mongoCollection.insertOne(randomContact);
  if (!res.acknowledged) {
    return buildErrorJson("unable to add contact", { data: randomContact });
  }

  const filter: Filter<ContactSchema> = { _id: res.insertedId };
  const addedContact = await mongoCollection.findOne(filter);

  return buildSuccessJson("successfully added contact", {
    data: { ...addedContact },
  });
}

export async function addMultipleRandom(req: Request) {
  const count = Number(req.params.count);
  if (isNaN(count) || count <= 0) {
    return buildErrorJson("please enter a number greater than 0");
  }

  const contacts: ContactSchema[] = [];
  for (let i = 0; i < count; i++) {
    contacts.push(createFakeContact());
  }

  const res = await mongoCollection.insertMany(contacts);
  return res.acknowledged
    ? buildSuccessJson(`successfully added ${count} random contacts`, {
        data: {
          count: res.insertedCount,
          ids: res.insertedIds,
        },
      })
    : buildErrorJson(`unable to add the ${count} random contacts`);
}

export async function view(req: Request) {
  if (!req.params.contact_id) {
    return buildErrorJson("contact_id not specified");
  }

  const filter: Filter<ContactSchema> = {
    _id: new ObjectId(req.params.contact_id),
  };

  const res = await mongoCollection.findOne(filter);

  return res
    ? buildSuccessJson("contact found", { data: res })
    : buildErrorJson(`${req.params.contact_id} not found`);
}

export async function update(req: Request) {
  if (!req.params.contact_id) {
    return buildErrorJson("contact_id not specified");
  }

  const filter: Filter<ContactSchema> = {
    _id: new ObjectId(req.params.contact_id),
  };

  const contact = await mongoCollection.findOne(filter);

  if (!contact) {
    return buildErrorJson(`${req.params.contact_id} not found`);
  }

  const updatedContact: ContactSchema = {
    email: req.body.email ?? contact.email,
    name: req.body.name ?? contact.name,
    gender: req.body.gender ?? contact.gender ?? "",
    phone: req.body.phone ?? contact.phone ?? "",
  };

  const update: UpdateFilter<ContactSchema> = { $set: updatedContact };

  const res = await mongoCollection.updateOne(filter, update, {
    upsert: false,
  });

  if (!res.acknowledged) {
    return buildErrorJson("unable to update contact");
  }

  const newContact = await mongoCollection.findOne(filter);

  return buildSuccessJson("contact updated", {
    data: { initial: contact, updated: newContact },
  });
}

export async function remove(req: Request) {
  if (!req.params.contact_id) {
    return buildErrorJson("contact_id not specified");
  }

  const filter: Filter<ContactSchema> = {
    _id: new ObjectId(req.params.contact_id),
  };

  const res = await mongoCollection.findOneAndDelete(filter, {});
  return res.value
    ? buildSuccessJson("successfully removed contact", { data: res.value })
    : buildErrorJson("contact not found");
}

export async function clearDb() {
  const res = await mongoCollection.deleteMany({});

  return res.acknowledged
    ? buildSuccessJson("db cleared", { count: res.deletedCount })
    : buildErrorJson("unable to clear db");
}

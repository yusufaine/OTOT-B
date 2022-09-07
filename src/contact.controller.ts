import { Request, Response } from "express";
import { Filter, ObjectId, UpdateFilter } from "mongodb";

import { ContactSchema } from "./contact.types";
import { mongoCollection } from "./mongo";
import { buildErrorJson, buildSuccessJson, createFakeContact } from "./utils";

export function index(_req: Request, res: Response) {
  mongoCollection
    .find({}, { projection: { __v: 0 } })
    .toArray((error, result) => {
      if (error) {
        res.json(buildErrorJson(error.message));
      } else {
        res.json(
          buildSuccessJson("contacts obtained successfully", {
            count: result.length,
            result,
          })
        );
      }
    });
}

export function add(req: Request, res: Response) {
  if (!(req.body.email && req.body.name)) {
    res.json(buildErrorJson("email and name has to be specified"));
    return;
  }

  const newContact: ContactSchema = {
    email: req.body.email,
    name: req.body.name,
  };

  if (req.body.gender) {
    newContact.gender = req.body.gender;
  }

  if (req.body.phone) {
    newContact.phone = req.body.phone;
  }

  mongoCollection.insertOne(newContact, (error, result) => {
    if (error) {
      res.json(buildErrorJson(error.message));
    } else {
      res.json(buildSuccessJson("contact added", result));
    }
  });
}

export async function addRandom(_req: Request, res: Response) {
  mongoCollection.insertOne(createFakeContact(), (error, result) => {
    if (error) {
      res.json(buildErrorJson(error.message));
    } else {
      res.json(buildSuccessJson("contact added", result));
    }
  });
}

export async function addNRandom(req: Request, res: Response) {
  const count: number = Number(req.params.count);
  if (count <= 0) {
    res.json(buildErrorJson("please enter a value > 0"));
  }

  const contacts: ContactSchema[] = [];
  for (let i = 0; i < count; i++) {
    contacts.push(createFakeContact());
  }

  mongoCollection.insertMany(contacts, (error, result) => {
    if (error) {
      res.json(buildErrorJson(error.message));
    } else {
      res.json(buildSuccessJson("contacts added successfully", result));
    }
  });
}

export function view(req: Request, res: Response) {
  if (!req.params.contact_id) {
    res.json(buildErrorJson("contact_id not specified"));
  }

  const filter: Filter<ContactSchema> = {
    _id: new ObjectId(req.params.contact_id),
  };

  mongoCollection.findOne(filter, (error, result) => {
    if (error) {
      res.json(buildErrorJson(error.message));
    } else {
      res.json(buildSuccessJson("contact found", result));
    }
  });
}

export async function update(req: Request, res: Response) {
  if (!req.params.contact_id) {
    res.json(buildErrorJson("contact_id not specified"));
    return;
  }

  const filter: Filter<ContactSchema> = {
    _id: new ObjectId(req.params.contact_id),
  };

  const contact = await mongoCollection.findOne(filter);

  if (!contact) {
    res.json(buildErrorJson("contact not found"));
  } else {
    contact.email = req.body.email ?? contact.email;
    contact.name = req.body.name ?? contact.name;

    if (contact.gender || req.body.gender) {
      contact.gender = req.body.gender ?? contact.gender;
    }

    if (contact.phone || req.body.phone) {
      contact.phone = req.body.phone ?? contact.phone;
    }

    const update: UpdateFilter<ContactSchema> = { $set: contact };

    mongoCollection.updateOne(filter, update, (error, result) => {
      if (error) {
        res.json(buildErrorJson(error.message));
      } else {
        res.json(buildSuccessJson("contact updated", { result, contact }));
      }
    });
  }
}

export function remove(req: Request, res: Response) {
  if (!req.params.contact_id) {
    res.json(buildErrorJson("contact_id not specified"));
    return;
  }

  const filter: Filter<ContactSchema> = {
    _id: new ObjectId(req.params.contact_id),
  };

  mongoCollection.deleteOne(filter, (error, result) => {
    if (error) {
      res.json(buildErrorJson(error.message));
    } else {
      const successString = `successfully removed contact ${req.params.contact_id}`;
      if (!result.deletedCount) {
        res.json(buildErrorJson("contact not found"));
      } else {
        res.json(buildSuccessJson(successString, result));
      }
    }
  });
}

export function clearDb(req: Request, res: Response) {
  mongoCollection.deleteMany({}, (error, result) => {
    if (error) {
      res.json(buildErrorJson(error.message));
    } else {
      res.json(buildSuccessJson("db cleared", result));
    }
  });
}

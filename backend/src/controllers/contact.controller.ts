import { Request, Response } from "express";
import { JsonResponseType } from "../utils/json.utils";

import * as contactService from "../services/contact.service";

export async function index(_req: Request, res: Response) {
  sendWithStatus(await contactService.index(), res);
}

export async function add(req: Request, res: Response) {
  sendWithStatus(await contactService.add(req), res);
}

export async function addRandom(_req: Request, res: Response) {
  sendWithStatus(await contactService.addRandom(), res);
}

export async function addMultipleRandom(req: Request, res: Response) {
  sendWithStatus(await contactService.addMultipleRandom(req), res);
}

export async function view(req: Request, res: Response) {
  sendWithStatus(await contactService.view(req), res);
}

export async function update(req: Request, res: Response) {
  sendWithStatus(await contactService.update(req), res);
}

export async function remove(req: Request, res: Response) {
  sendWithStatus(await contactService.remove(req), res);
}

export async function clearDb(_req: Request, res: Response) {
  sendWithStatus(await contactService.clearDb(), res);
}

function sendWithStatus(data: JsonResponseType, res: Response) {
  return data.status === "error" ? res.status(400).json(data) : res.json(data);
}

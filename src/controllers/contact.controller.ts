import { Request, Response } from "express";

import * as contactService from "../services/contact.service";

export async function index(_req: Request, res: Response) {
  res.json(await contactService.index());
}

export async function add(req: Request, res: Response) {
  res.json(await contactService.add(req));
}

export async function addRandom(_req: Request, res: Response) {
  res.json(await contactService.addRandom());
}

export async function addMultipleRandom(req: Request, res: Response) {
  res.json(await contactService.addMultipleRandom(req));
}

export async function view(req: Request, res: Response) {
  res.json(await contactService.view(req));
}

export async function update(req: Request, res: Response) {
  res.json(await contactService.update(req));
}

export async function remove(req: Request, res: Response) {
  res.json(await contactService.remove(req));
}

export async function clearDb(_req: Request, res: Response) {
  res.json(await contactService.clearDb());
}

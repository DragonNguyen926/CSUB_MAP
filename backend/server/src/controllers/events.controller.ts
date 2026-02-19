import {Request, Response} from "express";

const events: any[] = [];
export function listEvents(req: Request, res: Response) {
    res.json({ "items" : events});
}

export function createEvents(req: Request, res: Response) {
    res.json({ message: "POST works"})
}
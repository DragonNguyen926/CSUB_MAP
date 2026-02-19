import { Router } from "express";
import { listEvents } from "../controllers/events.controller";
const router = Router();

router.get("/", listEvents);
export default router;
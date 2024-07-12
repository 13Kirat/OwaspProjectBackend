import {
	deleteEvent,
	getAllEvents,
	getMyEvents,
	getSingleEvent,
	postEvent,
	updateEvent,
} from "../controllers/eventController.js";

import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall", getAllEvents);
router.get("/getmyevents", isAuthenticated, getMyEvents);
router.get("/:id", isAuthenticated, getSingleEvent);
router.put("/update/:id", isAuthenticated, updateEvent);
router.delete("/delete/:id", isAuthenticated, deleteEvent);
router.post("/post", isAuthenticated, postEvent);

export default router;

import express from "express";
import { getRoomMessages } from "../controllers/messagesController.js";

const router = express.Router();

router.route("/:roomId").get(getRoomMessages);

export default router;

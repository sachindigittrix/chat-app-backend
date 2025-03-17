import express from "express";
import {
  getRoomMessages,
  saveFile,
} from "../controllers/messagesController.js";
import upload from "../config/multer.js";

const router = express.Router();

router.route("/:roomId").get(getRoomMessages);
router.route("/file").post(upload.single("file"), saveFile);

export default router;

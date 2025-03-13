import express from "express";
import { createUser } from "../controllers/usersController.js";

const router = express.Router();

router.route("/").post(createUser);

export default router;

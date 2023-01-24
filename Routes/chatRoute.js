import express from "express";
import { createChat, findChat, userChats } from "../Controller/chatControllers.js";
import authMiddlware from "../Middlewares/authMiddlware.js";

const router = express.Router();

router.post("/", createChat);
router.get("/:userId", userChats);
router.get("/find/:firstId/:secondId",findChat);

export default router;

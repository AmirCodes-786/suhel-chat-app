import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken, clearChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);
router.post("/clear", protectRoute, clearChat);

export default router;

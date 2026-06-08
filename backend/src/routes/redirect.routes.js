import { Router } from "express";
import { redirectToOriginalUrl } from "../controllers/redirect.controller.js";

const router = Router();

router.get("/:shortCode", redirectToOriginalUrl);

export default router;

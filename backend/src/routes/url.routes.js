import { Router } from "express";
import { createUrl } from "../controllers/url.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createUrlSchema } from "../validators/url.validator.js";

const router = Router();
router.post("/", validate(createUrlSchema), createUrl);

export default router;

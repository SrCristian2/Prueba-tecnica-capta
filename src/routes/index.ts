import { Router } from "express";
import { healthRoutes } from "./healthRoutes";
import { workingDateRoutes } from "./workingDateRoutes";

const router = Router();

router.use("/api/v1", healthRoutes);
router.use("/api/v1", workingDateRoutes);

export { router as routes };

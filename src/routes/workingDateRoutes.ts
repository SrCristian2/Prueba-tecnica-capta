import { Router } from "express";
import { WorkingDateController } from "../controllers/workingDateController";

const router = Router();

router.get(
  "/calculate-working-date",
  WorkingDateController.calculateWorkingDate
);

export { router as workingDateRoutes };

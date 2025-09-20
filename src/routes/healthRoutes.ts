import { Router, Request, Response } from "express";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Working Days API is running",
    timestamp: new Date().toISOString(),
  });
});

export { router as healthRoutes };

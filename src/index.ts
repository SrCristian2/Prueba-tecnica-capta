import express, { Application } from "express";
import { WorkingDateController } from "./controllers/workingDateController";
import { HolidayService } from "./services/holidayService";

const expressApp: Application = express();
const SERVER_PORT = process.env.PORT || 3000;

expressApp.use(express.json());

expressApp.get(
  "/api/v1/calculate-working-date",
  WorkingDateController.calculateWorkingDate
);

async function initializeApplication(): Promise<void> {
  try {
    console.log("Loading Colombian holidays...");
    await HolidayService.loadHolidays();
    console.log("Holidays loaded successfully");

    expressApp.listen(SERVER_PORT, () => {
      console.log(`Working Days API is running on port ${SERVER_PORT}`);
      console.log(`Health check: http://localhost:${SERVER_PORT}/health`);
      console.log(
        `API endpoint: http://localhost:${SERVER_PORT}/calculate-working-date`
      );
    });
  } catch (initializationError) {
    console.error("Failed to initialize app:", initializationError);
    process.exit(1);
  }
}

initializeApplication();

export { expressApp as app, initializeApplication as initializeApp };

import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import { COLOMBIA_TIMEZONE, ValidatedParams } from "../types";
import { WorkingDayCalculator } from "../utils/workingDayCalculator";

export class WorkingDateService {
  public static calculateWorkingDate(validatedParams: ValidatedParams): Date {
    let baseStartDate: Date;

    if (validatedParams.date) {
      baseStartDate = utcToZonedTime(validatedParams.date, COLOMBIA_TIMEZONE);
    } else {
      baseStartDate = utcToZonedTime(new Date(), COLOMBIA_TIMEZONE);
    }

    let calculatedWorkingDate = baseStartDate;

    if (
      (validatedParams.days && validatedParams.days > 0) ||
      (validatedParams.hours && validatedParams.hours > 0)
    ) {
      calculatedWorkingDate = WorkingDayCalculator.adjustToWorkingTime(baseStartDate);
    }

    if (validatedParams.days && validatedParams.days > 0) {
      calculatedWorkingDate = WorkingDayCalculator.addWorkingDays(
        calculatedWorkingDate,
        validatedParams.days
      );
    }

    if (validatedParams.hours && validatedParams.hours > 0) {
      calculatedWorkingDate = WorkingDayCalculator.addWorkingHours(
        calculatedWorkingDate,
        validatedParams.hours
      );
    }

    return zonedTimeToUtc(calculatedWorkingDate, COLOMBIA_TIMEZONE);
  }

  public static formatApiResponse(responseDate: Date): string {
    return responseDate.toISOString();
  }
}

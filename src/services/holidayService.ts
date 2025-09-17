import { HolidayDate } from "../types";
import axios from "axios";

export class HolidayService {
  private static holidayDatesSet: Set<string> = new Set();

  public static async loadHolidays(): Promise<void> {
    try {
      const { data: holidayData } = await axios.get(
        "https://content.capta.co/Recruitment/WorkingDays.json"
      );
      const holidayDatesList = holidayData as HolidayDate[];
      this.holidayDatesSet = new Set(holidayDatesList);
    } catch (loadingError) {
      console.error("Error loading holidays:", loadingError);
      throw new Error("Failed to load holidays");
    }
  }

  public static isHoliday(checkDate: Date): boolean {
    const formattedDateString = checkDate.toISOString().split("T")[0];
    return this.holidayDatesSet.has(formattedDateString);
  }

  public static getHolidays(): string[] {
    return Array.from(this.holidayDatesSet);
  }
}

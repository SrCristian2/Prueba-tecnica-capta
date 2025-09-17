import {
  addDays,
  addMinutes,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";
import { WORKING_HOURS } from "../types";
import { HolidayService } from "../services/holidayService";

export class WorkingDayCalculator {
  public static isWorkingDay(date: Date): boolean {
    const dayOfWeek = date.getDay();
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    return isWeekday && !HolidayService.isHoliday(date);
  }

  public static isWorkingHour(date: Date): boolean {
    const toMin = (h: number, m = 0) => h * 60 + m;

    const START = toMin(WORKING_HOURS.start);
    const LUNCH_START = toMin(WORKING_HOURS.lunchStart);
    const LUNCH_END = toMin(WORKING_HOURS.lunchEnd);
    const END = toMin(WORKING_HOURS.end);

    const minutes = date.getHours() * 60 + date.getMinutes();

    return (
      (minutes >= START && minutes < LUNCH_START) ||
      (minutes >= LUNCH_END && minutes < END)
    );
  }

  public static adjustToWorkingTime(date: Date): Date {
    let adjustedDate = new Date(date);

    if (!this.isWorkingDay(adjustedDate)) {
      do {
        adjustedDate = addDays(adjustedDate, -1);
      } while (!this.isWorkingDay(adjustedDate));
      return this.setHMS(adjustedDate, WORKING_HOURS.end, 0, 0, 0);
    }

    const currentHour = adjustedDate.getHours();
    const currentMinute = adjustedDate.getMinutes();

    if (currentHour < WORKING_HOURS.start) {
      do {
        adjustedDate = addDays(adjustedDate, -1);
      } while (!this.isWorkingDay(adjustedDate));
      return this.setHMS(adjustedDate, WORKING_HOURS.end, 0, 0, 0);
    }

    if (
      currentHour === WORKING_HOURS.lunchStart ||
      (currentHour === WORKING_HOURS.lunchEnd && currentMinute === 0)
    ) {
      return this.setHMS(adjustedDate, WORKING_HOURS.lunchStart, 59, 59, 999);
    }

    if (currentHour >= WORKING_HOURS.end) {
      return this.setHMS(adjustedDate, WORKING_HOURS.end, 0, 0, 0);
    }

    return this.setHMS(adjustedDate, currentHour, currentMinute, 0, 0);
  }

  public static getNextWorkingMoment(date: Date): Date {
    let nextWorkingDate = new Date(date);

    if (
      this.isWorkingDay(nextWorkingDate) &&
      this.isWorkingHour(nextWorkingDate)
    ) {
      return nextWorkingDate;
    }

    const currentHour = nextWorkingDate.getHours();
    const currentMinute = nextWorkingDate.getMinutes();

    if (this.isWorkingDay(nextWorkingDate)) {
      if (currentHour < WORKING_HOURS.start) {
        return this.setHMS(nextWorkingDate, WORKING_HOURS.start, 0, 0, 0);
      }
      if (
        currentHour === WORKING_HOURS.lunchStart ||
        (currentHour === WORKING_HOURS.lunchEnd && currentMinute === 0)
      ) {
        return this.setHMS(nextWorkingDate, WORKING_HOURS.lunchEnd, 0, 0, 0);
      }
      if (currentHour >= WORKING_HOURS.end) {
        nextWorkingDate = this.setHMS(
          addDays(nextWorkingDate, 1),
          WORKING_HOURS.start,
          0,
          0,
          0
        );
      }
    } else {
      nextWorkingDate = this.setHMS(
        addDays(nextWorkingDate, 1),
        WORKING_HOURS.start,
        0,
        0,
        0
      );
    }

    while (!this.isWorkingDay(nextWorkingDate)) {
      nextWorkingDate = this.setHMS(
        addDays(nextWorkingDate, 1),
        WORKING_HOURS.start,
        0,
        0,
        0
      );
    }
    return nextWorkingDate;
  }


  public static addWorkingDays(
    startDate: Date,
    workingDaysToAdd: number
  ): Date {
    if (workingDaysToAdd === 0) return new Date(startDate);
    let currentDate = new Date(startDate);
    let remainingDays = workingDaysToAdd;

    while (remainingDays > 0) {
      currentDate = addDays(currentDate, 1);
      if (this.isWorkingDay(currentDate)) remainingDays--;
    }
    return currentDate;
  }


  public static addWorkingHours(
    startDate: Date,
    workingHoursToAdd: number
  ): Date {
    if (workingHoursToAdd === 0) return new Date(startDate);

    let currentDateTime = this.getNextWorkingMoment(startDate);
    let remainingMinutes = Math.round(workingHoursToAdd * 60);

    while (remainingMinutes > 0) {
      currentDateTime = this.getNextWorkingMoment(currentDateTime);
      const currentHour = currentDateTime.getHours();
      const currentMinute = currentDateTime.getMinutes();

      const segmentEndHour =
        currentHour < WORKING_HOURS.lunchStart
          ? WORKING_HOURS.lunchStart
          : WORKING_HOURS.end;
      const minutesUntilBreak =
        (segmentEndHour - currentHour) * 60 - currentMinute;

      if (remainingMinutes <= minutesUntilBreak) {
        currentDateTime = addMinutes(currentDateTime, remainingMinutes);
        remainingMinutes = 0;
      } else {
        currentDateTime = this.setHMS(currentDateTime, segmentEndHour, 0, 0, 0);
        remainingMinutes -= minutesUntilBreak;

        if (segmentEndHour === WORKING_HOURS.lunchStart) {
          currentDateTime = this.setHMS(
            currentDateTime,
            WORKING_HOURS.lunchEnd,
            0,
            0,
            0
          );
        } else {
          do {
            currentDateTime = this.setHMS(
              addDays(currentDateTime, 1),
              WORKING_HOURS.start,
              0,
              0,
              0
            );
          } while (!this.isWorkingDay(currentDateTime));
        }
      }
    }
    return currentDateTime;
  }

  private static setHMS(
    date: Date,
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number
  ): Date {
    let newDate = new Date(date);
    newDate = setHours(newDate, hours);
    newDate = setMinutes(newDate, minutes);
    newDate = setSeconds(newDate, seconds);
    newDate = setMilliseconds(newDate, milliseconds);
    return newDate;
  }
}

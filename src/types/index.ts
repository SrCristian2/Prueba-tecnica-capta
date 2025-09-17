// Tipos para la API
export interface QueryParams {
  days?: string;
  hours?: string;
  date?: string;
}

export interface ValidatedParams {
  days?: number;
  hours?: number;
  date?: Date;
}

export interface ApiResponse {
  date: string;
}

export interface ApiError {
  error: string;
  message: string;
}

export type HolidayDate = string;

export interface WorkingHours {
  start: number;
  lunchStart: number;
  lunchEnd: number;
  end: number;
}

export interface TimeCalculation {
  date: Date;
  isWorkingDay: boolean;
  isWorkingHour: boolean;
}

export const COLOMBIA_TIMEZONE = "America/Bogota";
export const WORKING_HOURS: WorkingHours = {
  start: 8,
  lunchStart: 12,
  lunchEnd: 13,
  end: 17,
};

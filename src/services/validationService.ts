import { QueryParams, ValidatedParams, ApiError } from '../types';

type ValidationResult =
  | { valid: true; data: ValidatedParams }
  | { valid: false; error: ApiError };

export class ValidationService {
  private static readonly ISO_UTC_REGEX =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

  public static validateParams(inputParams: QueryParams): ValidationResult {
    const { days, hours, date } = inputParams ?? {};

    if (days == null && hours == null) {
      return this.err('InvalidParameters', 'At least one of "days" or "hours" must be provided');
    }

    const validatedResult: ValidatedParams = {};

    if (days != null) {
      const validatedDaysNumber = this.toNonNegativeInt(days);
      if (validatedDaysNumber == null) {
        return this.err('InvalidParameters', 'Parameter "days" must be a non-negative integer');
      }
      validatedResult.days = validatedDaysNumber;
    }

    if (hours != null) {
      const validatedHoursNumber = this.toNonNegativeInt(hours);
      if (validatedHoursNumber == null) {
        return this.err('InvalidParameters', 'Parameter "hours" must be a non-negative integer');
      }
      validatedResult.hours = validatedHoursNumber;
    }

    if (date != null) {
      const dateString = typeof date === 'string' ? date.trim() : String(date);
      if (!this.ISO_UTC_REGEX.test(dateString)) {
        return this.err(
          'InvalidParameters',
          'Parameter "date" must be an ISO 8601 UTC string ending with "Z" (e.g., 2025-09-15T12:34:56Z)'
        );
      }

      const parsedTimestamp = Date.parse(dateString);
      if (Number.isNaN(parsedTimestamp)) {
        return this.err('InvalidParameters', 'Parameter "date" must be a valid ISO 8601 date in UTC format');
      }

      validatedResult.date = new Date(parsedTimestamp);
    }

    return { valid: true, data: validatedResult };
  }


  private static toNonNegativeInt(inputValue: string | number): number | null {
    const parsedNumber =
      typeof inputValue === 'number'
        ? inputValue
        : (inputValue as string).trim() === ''
        ? NaN
        : Number((inputValue as string).trim());

    if (!Number.isFinite(parsedNumber) || !Number.isInteger(parsedNumber) || parsedNumber < 0) return null;
    return parsedNumber;
  }

  private static err(errorType: ApiError['error'], errorMessage: string): { valid: false; error: ApiError } {
    return { valid: false, error: { error: errorType, message: errorMessage } };
  }
}

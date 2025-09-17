import { Request, Response } from "express";
import { QueryParams, ApiResponse, ApiError } from "../types";
import { ValidationService } from "../services/validationService";
import { WorkingDateService } from "../services/workingDateService";

export class WorkingDateController {
  public static async calculateWorkingDate(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      const requestQueryParams: QueryParams = {
        days: request.query.days as string | undefined,
        hours: request.query.hours as string | undefined,
        date: request.query.date as string | undefined,
      };

      const validationResult = ValidationService.validateParams(requestQueryParams);
      if (!validationResult.valid) {
        response.status(400).json(validationResult.error);
        return;
      }

      const calculatedWorkingDate = WorkingDateService.calculateWorkingDate(
        validationResult.data!
      );

      const apiResponse: ApiResponse = {
        date: WorkingDateService.formatApiResponse(calculatedWorkingDate),
      };

      response.status(200).json(apiResponse);
    } catch (processingError) {
      console.error("Error processing request:", processingError);
      const errorResponse: ApiError = {
        error: "InternalServerError",
        message: "An unexpected error occurred while processing the request",
      };
      response.status(500).json(errorResponse);
    }
  }
}

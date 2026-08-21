import { Response } from "express";

import { Result } from "../result";
import { isFailure } from "../result/result.guard";

export function resultResponse<T>(
    result: Result<T>,
    response: Response,
    successStatus = 200
): Response {
    if (isFailure(result)) {
        return response.status(result.error.statusCode).json({
            error: result.error.name,
            message: result.error.message,
        });
    }

    return response.status(successStatus).json(result.data);
}

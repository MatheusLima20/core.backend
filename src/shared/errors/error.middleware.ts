import { NextFunction, Request, Response } from "express";

import { AppError } from "./app.error";

export function errorMiddleware(
    error: unknown,
    request: Request,
    response: Response,
    next: NextFunction
): void {
    if (response.headersSent) {
        next(error);
        return;
    }

    if (error instanceof AppError) {
        response.status(error.statusCode).json({
            error: error.message,
        });

        return;
    }

    console.error(error);

    response.status(500).json({
        error: "Internal server error",
    });
}

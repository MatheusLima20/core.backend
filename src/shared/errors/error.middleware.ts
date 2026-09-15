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
            success: false,
            error: {
                name: error.name,
                message: error.message,
                statusCode: error.statusCode,
            },
        });

        return;
    }

    response.status(500).json({
        success: false,
        error: {
            name: "InternalServerError",
            message: "Internal server error",
            statusCode: 500,
        },
    });
}

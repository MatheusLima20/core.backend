import { NextFunction, Request, Response } from "express";

import { JWTProvider } from "./jwt.provider";

export async function authMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return response.status(401).json({
            message: "Token not provided.",
        });
    }

    const [, token] = authHeader.split(" ");

    try {
        const jwtProvider = new JWTProvider();

        request.auth = {
            user: await jwtProvider.verify(token),
        };

        next();
    } catch {
        return response.status(401).json({
            message: "Invalid token.",
        });
    }
}

import { NextFunction, Request, Response } from "express";

import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";

import { InvalidTokenError } from "../errors/invalid-token.error";
import { TokenNotProvidedError } from "../errors/token-not-provided.error";
import { ITokenProvider } from "../providers/token-provider.interface";

export class AuthMiddleware {
    constructor(private readonly tokenProvider: ITokenProvider) {}

    async handle(request: Request, response: Response, next: NextFunction): Promise<void> {
        const authorization = request.headers.authorization;

        if (!authorization) {
            const result = ResultFactory.failure(new TokenNotProvidedError());

            response.status(401).json(result);

            return;
        }

        const [type, token] = authorization.split(" ");

        if (type !== "Bearer" || !token) {
            const result = ResultFactory.failure(new InvalidTokenError());

            response.status(401).json(result);

            return;
        }

        const result = await this.tokenProvider.verify(token);

        if (isFailure(result)) {
            response.status(401).json(result);

            return;
        }

        request.auth = {
            user: result.data,
        };

        next();
    }
}

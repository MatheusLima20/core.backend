import jwt, { JwtPayload } from "jsonwebtoken";

import { env } from "@/config/env";
import { AuthUser } from "@/shared/context/auth.user";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { InvalidTokenError } from "../../errors/invalid-token.error";
import { ITokenProvider } from "../token-provider.interface";

export class JWTTokenProvider implements ITokenProvider {
    async generate(userUID: string, platformUID: string): Promise<Result<string>> {
        const token = jwt.sign(
            {
                userUID,
                platformUID,
            },
            env.jwt.secret,
            {
                expiresIn: env.jwt.expiresIn,
            }
        );

        return ResultFactory.success(token);
    }

    async verify(token: string): Promise<Result<AuthUser>> {
        try {
            const decoded = jwt.verify(token, env.jwt.secret);

            if (typeof decoded === "string" || !this.isValidPayload(decoded)) {
                return ResultFactory.failure(new InvalidTokenError());
            }

            return ResultFactory.success({
                uid: decoded.userUID,
                platformUID: decoded.platformUID,
            });
        } catch {
            return ResultFactory.failure(new InvalidTokenError());
        }
    }

    private isValidPayload(payload: string | JwtPayload): payload is JwtPayload & {
        userUID: string;
        platformUID: string;
    } {
        return (
            typeof payload === "object" &&
            typeof payload.userUID === "string" &&
            typeof payload.platformUID === "string"
        );
    }
}

import jwt, { JwtPayload } from "jsonwebtoken";

import { env } from "@/config/env";
import { MembershipRole } from "@/modules/membership/enums/membership-role.enum";
import { AuthUser } from "@/shared/context/auth.user";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { InvalidTokenError } from "../../errors/invalid-token.error";
import { ITokenProvider } from "../token-provider.interface";

export class JWTTokenProvider implements ITokenProvider {
    async generate(auth: AuthUser): Promise<Result<string>> {
        const token = jwt.sign(
            {
                uid: auth.uid,
                platformUID: auth.platformUID,
                membershipUID: auth.membershipUID,
                role: auth.role,
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
                uid: decoded.uid,
                platformUID: decoded.platformUID,
                membershipUID: decoded.membershipUID,
                role: decoded.role,
            });
        } catch {
            return ResultFactory.failure(new InvalidTokenError());
        }
    }

    private isValidPayload(payload: string | JwtPayload): payload is JwtPayload & {
        uid: string;
        platformUID: string;
        membershipUID: string;
        role: MembershipRole;
    } {
        return (
            typeof payload === "object" &&
            typeof payload.uid === "string" &&
            typeof payload.platformUID === "string" &&
            typeof payload.membershipUID === "string" &&
            typeof payload.role === "string" &&
            Object.values(MembershipRole).includes(payload.role as MembershipRole)
        );
    }
}

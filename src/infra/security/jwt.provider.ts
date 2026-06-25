import jwt from "jsonwebtoken";

import { AuthUser } from "@/shared/context/auth.user";

export class JWTProvider {
    async generate(userUID: string, platformUID: string): Promise<string> {
        return jwt.sign(
            {
                userUID,
                platformUID,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "1d",
            },
        );
    }

    async verify(token: string): Promise<AuthUser> {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
            userUID: string;
            platformUID: string;
        };

        return {
            uid: payload.userUID,
            platformUID: payload.platformUID,
        };
    }
}

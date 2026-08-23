import { AuthUser } from "@/shared/context/auth.user";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { InvalidTokenError } from "../../errors/invalid-token.error";
import { ITokenProvider } from "../token-provider.interface";

export class FakeTokenProvider implements ITokenProvider {
    async generate(userUID: string, platformUID: string): Promise<Result<string>> {
        return ResultFactory.success(`token_${userUID}_${platformUID}`);
    }

    async verify(token: string): Promise<Result<AuthUser>> {
        const prefix = "token_";

        if (!token.startsWith(prefix)) {
            return ResultFactory.failure(new InvalidTokenError());
        }

        const values = token.replace(prefix, "").split("_");

        const [uid, platformUID] = values;

        if (!uid || !platformUID) {
            return ResultFactory.failure(new InvalidTokenError());
        }

        return ResultFactory.success({
            uid,
            platformUID,
        });
    }
}

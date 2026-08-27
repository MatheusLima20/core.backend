import { MembershipRole } from "@/modules/membership/enums/membership-role.enum";
import { AuthUser } from "@/shared/context/auth.user";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { InvalidTokenError } from "../../errors/invalid-token.error";
import { ITokenProvider } from "../token-provider.interface";

export class FakeTokenProvider implements ITokenProvider {
    async generate(auth: AuthUser): Promise<Result<string>> {
        return ResultFactory.success(
            `token_${auth.uid}_${auth.platformUID}_${auth.membershipUID}_${auth.role}`
        );
    }

    async verify(token: string): Promise<Result<AuthUser>> {
        const prefix = "token_";

        if (!token.startsWith(prefix)) {
            return ResultFactory.failure(new InvalidTokenError());
        }

        const values = token.replace(prefix, "").split("_");

        const [uid, platformUID, membershipUID, role] = values;

        if (!uid || !platformUID || !membershipUID || !role) {
            return ResultFactory.failure(new InvalidTokenError());
        }

        if (!Object.values(MembershipRole).includes(role as MembershipRole)) {
            return ResultFactory.failure(new InvalidTokenError());
        }

        return ResultFactory.success({
            uid,
            platformUID,
            membershipUID,
            role: role as MembershipRole,
        });
    }
}

import { AuthUser } from "@/shared/context/auth.user";

import { ITokenProvider } from "../token-provider.interface";

export class FakeTokenProvider implements ITokenProvider {
    async generate(userUID: string, platformUID: string): Promise<string> {
        return `token_${userUID}_${platformUID}`;
    }

    async verify(token: string): Promise<AuthUser> {
        throw new Error("Method not implemented." + token);
    }
}

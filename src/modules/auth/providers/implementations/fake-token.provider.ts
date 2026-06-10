import { AuthUser } from "@/@types/express";
import { ITokenProvider } from "../token-provider.interface";

export class FakeTokenProvider implements ITokenProvider {
    async generate(userUID: string, platformUID: string): Promise<string> {
        return `token_${userUID}_${platformUID}`;
    }

    async verify(token: string): Promise<AuthUser> {
        const [, userUID, platformUID] = token.split("_");

        return {
            uid: userUID,
            platformUID,
        };
    }
}

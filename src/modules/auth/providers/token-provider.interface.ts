import { AuthUser } from "@/@types/express";

export interface ITokenProvider {
    generate(userUID: string, platformUID: string): Promise<string>;
    verify(token: string): Promise<AuthUser>;
}

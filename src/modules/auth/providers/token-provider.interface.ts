import { AuthUser } from "@/shared/context/auth.user";
import { Result } from "@/shared/result";

export interface ITokenProvider {
    generate(userUID: string, platformUID: string): Promise<Result<string>>;

    verify(token: string): Promise<Result<AuthUser>>;
}

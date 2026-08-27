import { AuthUser } from "@/shared/context/auth.user";
import { Result } from "@/shared/result";

export interface ITokenProvider {
    generate(authUser: AuthUser): Promise<Result<string>>;

    verify(token: string): Promise<Result<AuthUser>>;
}

import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";
import { isFailure } from "@/shared/result/result.guard";

export async function makeLoggedUser(
    repository: InMemoryUserRepository,
    uid = "1"
): Promise<AuthUser> {
    const user = await repository.findByUID(uid);

    if (isFailure(user)) {
        throw new Error("User not found.");
    }

    const data = user.data;

    return {
        uid: data?.uid ?? "",
        platformUID: data?.platformUID ?? "",
    };
}

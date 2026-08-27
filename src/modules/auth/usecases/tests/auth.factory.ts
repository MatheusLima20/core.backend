import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";
import { isFailure } from "@/shared/result/result.guard";

export async function makeLoggedUser(
    userRepository: InMemoryUserRepository,
    membershipRepository: InMemoryMembershipRepository,
    userUID = "1"
): Promise<AuthUser> {
    const userResult = await userRepository.findByUID(userUID);

    if (isFailure(userResult) || !userResult.data) {
        throw new Error("User not found.");
    }

    const membershipsResult = await membershipRepository.listByUser(userUID);

    if (isFailure(membershipsResult) || membershipsResult.data.length === 0) {
        throw new Error("Membership not found.");
    }

    const membership = membershipsResult.data[0];

    return {
        uid: userResult.data.uid,
        platformUID: membership.platformUID,
        membershipUID: membership.uid,
        role: membership.role,
    };
}

import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";

import { AuthUser } from "../context/auth.user";

export interface BaseTestContext {
    userRepository: InMemoryUserRepository;
    membershipRepository: InMemoryMembershipRepository;
    users: AuthUser[];
}

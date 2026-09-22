import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryCategoryRepository } from "../../../repositories/implementations/in-memory-category.repository";
import { CategoryUsecase } from "../../category.usecase";

export class TestCategoryContext {
    userRepository = new InMemoryUserRepository();

    categoryRepository = new InMemoryCategoryRepository();

    membershipRepository = new InMemoryMembershipRepository();

    users: AuthUser[] = [];

    usecases: CategoryUsecase[] = [];
}

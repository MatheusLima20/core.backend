import { InMemoryCategoryRepository } from "@/modules/category/repositories/implementations/in-memory-category.repository";
import { CategoryUsecase } from "@/modules/category/usecases/category.usecase";
import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryProductRepository } from "../../../repositories/implementations/in-memory-product.repository";
import { ProductUsecase } from "../../product.usecase";

export class TestProductContext {
    userRepository = new InMemoryUserRepository();

    membershipRepository = new InMemoryMembershipRepository();

    categoryRepository = new InMemoryCategoryRepository();

    productRepository = new InMemoryProductRepository();

    users: AuthUser[] = [];

    usecases: ProductUsecase[] = [];

    categoryUsecases: CategoryUsecase[] = [];
}

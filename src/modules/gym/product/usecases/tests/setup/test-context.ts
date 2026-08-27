import { InMemoryProductRepository } from "@/modules/gym/product/repositories/implementations/in-memory-product.repository";
import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { ProductUsecase } from "../../product.usecase";

export class TestContext {
    userRepository = new InMemoryUserRepository();
    productRepository = new InMemoryProductRepository();

    membershipRepository = new InMemoryMembershipRepository();

    users: AuthUser[] = [];
    usecases: ProductUsecase[] = [];
}

import { InMemoryProductRepository } from "@/modules/gym/product/repositories/implementations/in-memory-product.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { ProductUsecase } from "../../product.usecase";

export class TestContext {
    userRepository = new InMemoryUserRepository();
    productRepository = new InMemoryProductRepository();

    users: AuthUser[] = [];
    usecases: ProductUsecase[] = [];
}

import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { InMemoryProductRepository } from "@/modules/product/repositories/implementations/in-memory-product.repository";
import { AuthUser } from "@/shared/context/auth.user";
import { ProductUsecase } from "../../product.usecase";

export class TestContext {
    userRepository = new InMemoryUserRepository();
    productRepository = new InMemoryProductRepository();

    users: AuthUser[] = [];
    usecases: ProductUsecase[] = [];
}

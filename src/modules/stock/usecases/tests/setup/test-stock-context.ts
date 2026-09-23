import { InMemoryCategoryRepository } from "@/modules/category/repositories/implementations/in-memory-category.repository";
import { CategoryUsecase } from "@/modules/category/usecases/category.usecase";
import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryProductRepository } from "@/modules/product/repositories/implementations/in-memory-product.repository";
import { ProductUsecase } from "@/modules/product/usecases/product.usecase";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryStockRepository } from "../../../repositories/implementations/in-memory-stock.repository";
import { StockUsecase } from "../../stock.usecase";

export class TestStockContext {
    userRepository = new InMemoryUserRepository();

    membershipRepository = new InMemoryMembershipRepository();

    categoryRepository = new InMemoryCategoryRepository();

    productRepository = new InMemoryProductRepository();

    stockRepository = new InMemoryStockRepository(this.productRepository);

    users: AuthUser[] = [];

    categoryUsecases: CategoryUsecase[] = [];

    productUsecases: ProductUsecase[] = [];

    usecases: StockUsecase[] = [];
}

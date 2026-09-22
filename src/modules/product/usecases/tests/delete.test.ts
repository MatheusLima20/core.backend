import { CategoryUsecase } from "@/modules/category/usecases/category.usecase";
import { dataCategory1 } from "@/modules/category/usecases/tests/factories/category-data.factory";

import { ProductUsecase } from "../product.usecase";
import { dataProduct1 } from "./factories/product-data.factory";
import { setupProductCategory } from "./setup/category-product.setup";
import { scenario } from "./setup/product.builder";
import { setupProduct } from "./setup/product.setup";

describe("ProductUsecase - delete", () => {
    let usecaseUser1!: ProductUsecase;
    let usecaseUser2!: ProductUsecase;

    let categoryUsecaseUser1!: CategoryUsecase;
    let categoryUsecaseUser2!: CategoryUsecase;

    let categoryUID1!: string;
    let categoryUID2!: string;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            categoryUsecases: [categoryUsecaseUser1, categoryUsecaseUser2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        const category1 = await setupProductCategory(categoryUsecaseUser1, dataCategory1);

        const category2 = await setupProductCategory(categoryUsecaseUser2, dataCategory1);

        categoryUID1 = category1.uid;
        categoryUID2 = category2.uid;
    });

    test("Should delete product", async () => {
        const product = await setupProduct(usecaseUser1, dataProduct1(categoryUID1));

        const result = await usecaseUser1.delete(product.uid);

        expect(result.success).toBe(true);

        const deleted = await usecaseUser1.findByUID(product.uid);

        expect(deleted.success).toBe(false);
    });

    test("Should return not found when product does not exist", async () => {
        const result = await usecaseUser1.delete("invalid-product-uid");

        expect(result.success).toBe(false);
    });

    test("Should not delete product from another platform", async () => {
        const product = await setupProduct(usecaseUser2, dataProduct1(categoryUID2));

        const result = await usecaseUser1.delete(product.uid);

        expect(result.success).toBe(false);

        const existing = await usecaseUser2.findByUID(product.uid);

        expect(existing.success).toBe(true);
    });
});

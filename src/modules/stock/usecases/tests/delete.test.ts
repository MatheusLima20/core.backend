import { CategoryUsecase } from "@/modules/category/usecases/category.usecase";
import { dataCategory1 } from "@/modules/category/usecases/tests/factories/category-data.factory";
import { ProductUsecase } from "@/modules/product/usecases/product.usecase";
import { dataProduct1 } from "@/modules/product/usecases/tests/factories/product-data.factory";
import { setupProductCategory } from "@/modules/product/usecases/tests/setup/category-product.setup";
import { expectFailure } from "@/shared/tests/result.helper";

import { StockNotFoundError } from "../../errors/stock-not-found.error";
import { StockUsecase } from "../stock.usecase";
import { dataStock1 } from "./factories/stock-data.factory";
import { scenario } from "./setup/stock.builder";
import { setupStock } from "./setup/stock.setup";

describe("StockUsecase - delete", () => {
    let usecaseUser1!: StockUsecase;
    let usecaseUser2!: StockUsecase;

    let categoryUsecaseUser1!: CategoryUsecase;
    let categoryUsecaseUser2!: CategoryUsecase;

    let productUsecaseUser1!: ProductUsecase;
    let productUsecaseUser2!: ProductUsecase;

    let categoryUID1!: string;
    let categoryUID2!: string;

    let productUID1!: string;
    let productUID2!: string;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            categoryUsecases: [categoryUsecaseUser1, categoryUsecaseUser2],
            productUsecases: [productUsecaseUser1, productUsecaseUser2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        const category1 = await setupProductCategory(categoryUsecaseUser1, dataCategory1);

        const category2 = await setupProductCategory(categoryUsecaseUser2, dataCategory1);

        categoryUID1 = category1.uid;
        categoryUID2 = category2.uid;

        const product1 = await productUsecaseUser1.create(dataProduct1(categoryUID1));

        const product2 = await productUsecaseUser2.create(dataProduct1(categoryUID2));

        expect(product1.success).toBe(true);
        expect(product2.success).toBe(true);

        if (!product1.success || !product2.success) return;

        productUID1 = product1.data.uid;
        productUID2 = product2.data.uid;
    });

    test("Should delete stock", async () => {
        const stock = await setupStock(usecaseUser1, dataStock1(productUID1));

        const result = await usecaseUser1.delete(stock.uid);

        expect(result.success).toBe(true);

        const deleted = await usecaseUser1.findByUID(stock.uid);

        expect(deleted.success).toBe(false);
    });

    test("Should return not found when stock does not exist", async () => {
        expectFailure(await usecaseUser1.delete("invalid-stock-uid"), StockNotFoundError);
    });

    test("Should not delete stock from another platform", async () => {
        const stock = await setupStock(usecaseUser2, dataStock1(productUID2));

        expectFailure(await usecaseUser1.delete(stock.uid), StockNotFoundError);

        const existing = await usecaseUser2.findByUID(stock.uid);

        expect(existing.success).toBe(true);
    });
});

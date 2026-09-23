import { CategoryUsecase } from "@/modules/category/usecases/category.usecase";
import {
    dataCategory1,
    dataCategory2,
} from "@/modules/category/usecases/tests/factories/category-data.factory";
import { ProductNotFoundError } from "@/modules/product/errors/product-not-found.error";
import { ProductUsecase } from "@/modules/product/usecases/product.usecase";
import {
    dataProduct1,
    dataProduct2,
} from "@/modules/product/usecases/tests/factories/product-data.factory";
import { setupProductCategory } from "@/modules/product/usecases/tests/setup/category-product.setup";
import { setupProduct } from "@/modules/product/usecases/tests/setup/product.setup";
import { AuthUser } from "@/shared/context/auth.user";

import { StockAlreadyExistsError } from "../../errors/stock-already-exists.error";
import { StockUsecase } from "../stock.usecase";
import { dataStock1, dataStock2 } from "./factories/stock-data.factory";
import { scenario } from "./setup/stock.builder";
import { expectCreateStockFailure, setupStock } from "./setup/stock.setup";

describe("StockUsecase - create", () => {
    let usecaseUser1!: StockUsecase;
    let usecaseUser2!: StockUsecase;

    let categoryUsecaseUser1!: CategoryUsecase;
    let categoryUsecaseUser2!: CategoryUsecase;

    let productUsecaseUser1!: ProductUsecase;
    let productUsecaseUser2!: ProductUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    let category1UID!: string;
    let category2UID!: string;

    let product1UID!: string;
    let product2UID!: string;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            categoryUsecases: [categoryUsecaseUser1, categoryUsecaseUser2],
            productUsecases: [productUsecaseUser1, productUsecaseUser2],
            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        const category1 = await setupProductCategory(categoryUsecaseUser1, dataCategory1);

        const category2 = await setupProductCategory(categoryUsecaseUser2, dataCategory2);

        category1UID = category1.uid;
        category2UID = category2.uid;

        const product1 = await setupProduct(productUsecaseUser1, dataProduct1(category1UID));

        const product2 = await setupProduct(productUsecaseUser2, dataProduct2(category2UID));

        product1UID = product1.uid;
        product2UID = product2.uid;
    });

    test("Should register a stock", async () => {
        const stock = await setupStock(usecaseUser1, dataStock1(product1UID));

        expect(stock).toMatchObject({
            productUID: product1UID,
            quantity: dataStock1(product1UID).quantity,
            minimumStock: dataStock1(product1UID).minimumStock,

            uid: expect.any(String),

            createdAt: expect.any(Date),

            createdBy: user1.uid,
        });
    });

    test("Should register stocks", async () => {
        const stock1 = await setupStock(usecaseUser1, dataStock1(product1UID));

        const stock2 = await setupStock(usecaseUser2, dataStock2(product2UID));

        expect(stock1).toMatchObject({
            productUID: product1UID,
            quantity: dataStock1(product1UID).quantity,
            minimumStock: dataStock1(product1UID).minimumStock,

            uid: expect.any(String),

            createdAt: expect.any(Date),

            createdBy: user1.uid,
        });

        expect(stock2).toMatchObject({
            productUID: product2UID,
            quantity: dataStock2(product2UID).quantity,
            minimumStock: dataStock2(product2UID).minimumStock,

            uid: expect.any(String),

            createdAt: expect.any(Date),

            createdBy: user2.uid,
        });
    });

    test("Should use the authenticated user platform", async () => {
        const stock = await setupStock(usecaseUser2, dataStock2(product2UID));

        expect(stock).toMatchObject({
            createdBy: user2.uid,
        });
    });

    test("Should allow stocks for products with the same name in different platforms", async () => {
        const stock1 = await setupStock(usecaseUser1, dataStock1(product1UID));

        const stock2 = await setupStock(usecaseUser2, dataStock1(product2UID));

        expect(stock1.productUID).toBe(product1UID);
        expect(stock2.productUID).toBe(product2UID);

        expect(stock1.productUID).not.toBe(stock2.productUID);
    });

    test("Should not register duplicated stock for the same product", async () => {
        const stock = dataStock1(product1UID);

        await setupStock(usecaseUser1, stock);

        await expectCreateStockFailure(usecaseUser1, stock, StockAlreadyExistsError);
    });

    test("Should register stock with zero quantity", async () => {
        const stock = await setupStock(usecaseUser1, {
            ...dataStock1(product1UID),
            quantity: 0,
        });

        expect(stock.quantity).toBe(0);
    });

    test("Should register stock with zero minimum stock", async () => {
        const stock = await setupStock(usecaseUser1, {
            ...dataStock1(product1UID),
            minimumStock: 0,
        });

        expect(stock.minimumStock).toBe(0);
    });

    test("Should not register stock for non-existent product", async () => {
        await expectCreateStockFailure(
            usecaseUser1,
            dataStock1("prd-non-existent"),
            ProductNotFoundError
        );
    });
});

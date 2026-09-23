import { CategoryUsecase } from "@/modules/category/usecases/category.usecase";
import { dataCategory1 } from "@/modules/category/usecases/tests/factories/category-data.factory";
import { ProductUsecase } from "@/modules/product/usecases/product.usecase";
import { dataProduct1 } from "@/modules/product/usecases/tests/factories/product-data.factory";
import { setupProductCategory } from "@/modules/product/usecases/tests/setup/category-product.setup";
import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { StockNotFoundError } from "../../errors/stock-not-found.error";
import { StockUsecase } from "../stock.usecase";
import { dataStock1 } from "./factories/stock-data.factory";
import { scenario } from "./setup/stock.builder";
import { setupStock } from "./setup/stock.setup";

describe("StockUsecase - findByUID", () => {
    let usecaseUser1!: StockUsecase;
    let usecaseUser2!: StockUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    let categoryUID!: string;
    let productUID!: string;

    let categoryUsecaseUser1!: CategoryUsecase;
    let productUsecaseUser1!: ProductUsecase;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],

            categoryUsecases: [categoryUsecaseUser1],

            productUsecases: [productUsecaseUser1],

            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        const category = await setupProductCategory(categoryUsecaseUser1, dataCategory1);

        categoryUID = category.uid;

        const product = expectSuccess(await productUsecaseUser1.create(dataProduct1(categoryUID)));

        productUID = product.uid;
    });

    test("Should find a stock by uid", async () => {
        const stock = await setupStock(usecaseUser1, dataStock1(productUID));

        const found = expectSuccess(await usecaseUser1.findByUID(stock.uid));

        expect(found).toMatchObject({
            uid: stock.uid,

            productUID,

            quantity: dataStock1(productUID).quantity,

            minimumStock: dataStock1(productUID).minimumStock,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            createdAt: stock.createdAt,
        });
    });

    test("Should return StockNotFoundError when uid does not exist", async () => {
        expectFailure(await usecaseUser1.findByUID("invalid-uid"), StockNotFoundError);
    });

    test("Should not find a stock from another platform", async () => {
        const stock = await setupStock(usecaseUser1, dataStock1(productUID));

        expectFailure(await usecaseUser2.findByUID(stock.uid), StockNotFoundError);
    });

    test("Should return all persisted stock data", async () => {
        const stock = await setupStock(usecaseUser1, dataStock1(productUID));

        const found = expectSuccess(await usecaseUser1.findByUID(stock.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: stock.uid,

                productUID,

                quantity: dataStock1(productUID).quantity,

                minimumStock: dataStock1(productUID).minimumStock,

                platformUID: user1.platformUID,

                createdBy: user1.uid,

                createdAt: expect.any(Date),
            })
        );

        expect(found.createdBy).not.toBe(user2.uid);
    });
});

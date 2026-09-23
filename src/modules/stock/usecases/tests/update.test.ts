import { CategoryUsecase } from "@/modules/category/usecases/category.usecase";
import { dataCategory1 } from "@/modules/category/usecases/tests/factories/category-data.factory";
import { ProductUsecase } from "@/modules/product/usecases/product.usecase";
import { dataProduct1 } from "@/modules/product/usecases/tests/factories/product-data.factory";
import { setupProductCategory } from "@/modules/product/usecases/tests/setup/category-product.setup";
import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { UpdateStockDTO } from "../../dtos/update-stock.dto";
import { StockNotFoundError } from "../../errors/stock-not-found.error";
import { StockUsecase } from "../stock.usecase";
import { dataStock1 } from "./factories/stock-data.factory";
import { scenario } from "./setup/stock.builder";
import { setupStock } from "./setup/stock.setup";

describe("StockUsecase - update", () => {
    let usecaseUser1!: StockUsecase;
    let usecaseUser2!: StockUsecase;

    let categoryUsecaseUser1!: CategoryUsecase;

    let productUsecaseUser1!: ProductUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    let product1UID!: string;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            categoryUsecases: [categoryUsecaseUser1],
            productUsecases: [productUsecaseUser1],
            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        const category1 = await setupProductCategory(categoryUsecaseUser1, dataCategory1);

        const product1 = expectSuccess(
            await productUsecaseUser1.create(dataProduct1(category1.uid))
        );

        product1UID = product1.uid;
    });

    test("Should update a stock", async () => {
        const stock = await setupStock(usecaseUser1, dataStock1(product1UID));

        const data: UpdateStockDTO = {
            uid: stock.uid,
            quantity: 300,
            minimumStock: 50,
        };

        const updated = expectSuccess(await usecaseUser1.update(data));

        expect(updated).toMatchObject({
            uid: stock.uid,
            productUID: product1UID,
            quantity: data.quantity,
            minimumStock: data.minimumStock,
            updatedAt: updated.updatedAt,
            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(stock.uid));

        expect(found).toMatchObject({
            uid: updated.uid,
            productUID: product1UID,
            quantity: updated.quantity,
            minimumStock: updated.minimumStock,
            updatedAt: updated.updatedAt,
            updatedBy: user1.uid,
        });

        expect(found.updatedBy).not.toBe(user2.uid);
    });

    test("Should update only quantity", async () => {
        const stock = await setupStock(usecaseUser1, dataStock1(product1UID));

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: stock.uid,
                quantity: 250,
            })
        );

        expect(updated.quantity).toBe(250);
        expect(updated.minimumStock).toBe(dataStock1(product1UID).minimumStock);
        expect(updated.productUID).toBe(product1UID);
    });

    test("Should update only minimum stock", async () => {
        const stock = await setupStock(usecaseUser1, dataStock1(product1UID));

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: stock.uid,
                minimumStock: 40,
            })
        );

        expect(updated.minimumStock).toBe(40);
        expect(updated.quantity).toBe(dataStock1(product1UID).quantity);
        expect(updated.productUID).toBe(product1UID);
    });

    test("Should update quantity to zero", async () => {
        const stock = await setupStock(usecaseUser1, dataStock1(product1UID));

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: stock.uid,
                quantity: 0,
            })
        );

        expect(updated.quantity).toBe(0);
    });

    test("Should update minimum stock to zero", async () => {
        const stock = await setupStock(usecaseUser1, dataStock1(product1UID));

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: stock.uid,
                minimumStock: 0,
            })
        );

        expect(updated.minimumStock).toBe(0);
    });

    test("Should not update an inexistent stock", async () => {
        expectFailure(
            await usecaseUser1.update({
                uid: "invalid-stock",
                quantity: 100,
            }),
            StockNotFoundError
        );
    });

    test("Should not update a stock from another platform", async () => {
        const stock = await setupStock(usecaseUser1, dataStock1(product1UID));

        expectFailure(
            await usecaseUser2.update({
                uid: stock.uid,
                quantity: 500,
            }),
            StockNotFoundError
        );
    });
});

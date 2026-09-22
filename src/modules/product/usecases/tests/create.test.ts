import { CategoryUsecase } from "@/modules/category/usecases/category.usecase";
import {
    dataCategory1,
    dataCategory2,
} from "@/modules/category/usecases/tests/factories/category-data.factory";
import { AuthUser } from "@/shared/context/auth.user";

import { ProductAlreadyExistsError } from "../../errors/product-already-exists.error";
import { ProductUsecase } from "../product.usecase";
import { dataProduct1, dataProduct2 } from "./factories/product-data.factory";
import { setupProductCategory } from "./setup/category-product.setup";
import { scenario } from "./setup/product.builder";
import { expectCreateProductFailure, setupProduct } from "./setup/product.setup";

describe("ProductUsecase - create", () => {
    let usecaseUser1!: ProductUsecase;
    let usecaseUser2!: ProductUsecase;

    let categoryUsecaseUser1!: CategoryUsecase;
    let categoryUsecaseUser2!: CategoryUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    let category1UID!: string;
    let category2UID!: string;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            categoryUsecases: [categoryUsecaseUser1, categoryUsecaseUser2],
            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        const category1 = await setupProductCategory(categoryUsecaseUser1, dataCategory1);

        const category2 = await setupProductCategory(categoryUsecaseUser2, dataCategory2);

        category1UID = category1.uid;
        category2UID = category2.uid;
    });

    test("Should register a product", async () => {
        const product = await setupProduct(usecaseUser1, dataProduct1(category1UID));

        expect(product).toMatchObject({
            categoryUID: category1UID,
            name: dataProduct1(category1UID).name,
            description: dataProduct1(category1UID).description,
            price: dataProduct1(category1UID).price,

            uid: expect.any(String),

            createdAt: expect.any(Date),

            createdBy: user1.uid,
        });
    });

    test("Should register products", async () => {
        const product1 = await setupProduct(usecaseUser1, dataProduct1(category1UID));

        const product2 = await setupProduct(usecaseUser2, dataProduct2(category2UID));

        expect(product1).toMatchObject({
            categoryUID: category1UID,
            name: dataProduct1(category1UID).name,
            description: dataProduct1(category1UID).description,
            price: dataProduct1(category1UID).price,

            uid: expect.any(String),

            createdAt: expect.any(Date),

            createdBy: user1.uid,
        });

        expect(product2).toMatchObject({
            categoryUID: category2UID,
            name: dataProduct2(category2UID).name,
            description: dataProduct2(category2UID).description,
            price: dataProduct2(category2UID).price,

            uid: expect.any(String),

            createdAt: expect.any(Date),

            createdBy: user2.uid,
        });
    });

    test("Should use the authenticated user platform", async () => {
        const product = await setupProduct(usecaseUser2, dataProduct1(category2UID));

        expect(product).toMatchObject({
            createdBy: user2.uid,
        });
    });

    test("Should allow same product name in different platforms", async () => {
        await setupProduct(usecaseUser1, dataProduct1(category1UID));

        await setupProduct(usecaseUser2, dataProduct1(category2UID));
    });

    test("Should not register duplicated product", async () => {
        const product = dataProduct1(category1UID);

        await setupProduct(usecaseUser1, product);

        await expectCreateProductFailure(usecaseUser1, product, ProductAlreadyExistsError);
    });

    test("Should register product with description", async () => {
        const product = await setupProduct(usecaseUser1, dataProduct1(category1UID));

        expect(product.description).toBe(dataProduct1(category1UID).description);
    });

    test("Should register product without description", async () => {
        const product = await setupProduct(usecaseUser1, {
            ...dataProduct1(category1UID),
            description: null,
        });

        expect(product.description).toBeNull();
    });
});

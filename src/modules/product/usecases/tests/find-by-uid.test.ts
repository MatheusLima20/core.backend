import { CategoryUsecase } from "@/modules/category/usecases/category.usecase";
import { dataCategory1 } from "@/modules/category/usecases/tests/factories/category-data.factory";
import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { ProductNotFoundError } from "../../errors/product-not-found.error";
import { ProductUsecase } from "../product.usecase";
import { dataProduct1 } from "./factories/product-data.factory";
import { setupProductCategory } from "./setup/category-product.setup";
import { scenario } from "./setup/product.builder";
import { setupProduct } from "./setup/product.setup";

describe("ProductUsecase - findByUID", () => {
    let usecaseUser1!: ProductUsecase;
    let usecaseUser2!: ProductUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    let categoryUID!: string;

    let categoryUsecaseUser1!: CategoryUsecase;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],

            categoryUsecases: [categoryUsecaseUser1],

            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        const category = await setupProductCategory(categoryUsecaseUser1, dataCategory1);

        categoryUID = category.uid;
    });

    test("Should find a product by uid", async () => {
        const product = await setupProduct(usecaseUser1, dataProduct1(categoryUID));

        const found = expectSuccess(await usecaseUser1.findByUID(product.uid));

        expect(found).toMatchObject({
            uid: product.uid,

            categoryUID,

            name: dataProduct1(categoryUID).name,

            description: dataProduct1(categoryUID).description,

            price: dataProduct1(categoryUID).price,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            createdAt: product.createdAt,
        });
    });

    test("Should return ProductNotFoundError when uid does not exist", async () => {
        expectFailure(await usecaseUser1.findByUID("invalid-uid"), ProductNotFoundError);
    });

    test("Should not find a product from another platform", async () => {
        const product = await setupProduct(usecaseUser1, dataProduct1(categoryUID));

        expectFailure(await usecaseUser2.findByUID(product.uid), ProductNotFoundError);
    });

    test("Should return all persisted product data", async () => {
        const product = await setupProduct(usecaseUser1, dataProduct1(categoryUID));

        const found = expectSuccess(await usecaseUser1.findByUID(product.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: product.uid,

                categoryUID,

                name: dataProduct1(categoryUID).name,

                description: dataProduct1(categoryUID).description,

                price: dataProduct1(categoryUID).price,

                platformUID: user1.platformUID,

                createdBy: user1.uid,

                createdAt: expect.any(Date),
            })
        );

        expect(found.createdBy).not.toBe(user2.uid);
    });
});

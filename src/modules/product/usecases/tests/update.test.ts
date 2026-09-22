import { CategoryNotFoundError } from "@/modules/category/errors/category-not-found.error";
import { CategoryUsecase } from "@/modules/category/usecases/category.usecase";
import {
    dataCategory1,
    dataCategory2,
} from "@/modules/category/usecases/tests/factories/category-data.factory";
import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { UpdateProductDTO } from "../../dtos/update-product.dto";
import { ProductAlreadyExistsError } from "../../errors/product-already-exists.error";
import { ProductNotFoundError } from "../../errors/product-not-found.error";
import { ProductUsecase } from "../product.usecase";
import { dataProduct1, dataProduct2 } from "./factories/product-data.factory";
import { setupProductCategory } from "./setup/category-product.setup";
import { scenario } from "./setup/product.builder";
import { setupProduct } from "./setup/product.setup";

describe("ProductUsecase - update", () => {
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

        const category2 = await setupProductCategory(categoryUsecaseUser1, dataCategory2);

        category1UID = category1.uid;
        category2UID = category2.uid;
    });

    test("Should update a product", async () => {
        const product = await setupProduct(usecaseUser1, dataProduct1(category1UID));

        const data: UpdateProductDTO = {
            uid: product.uid,
            categoryUID: category2UID,
            name: "Updated Product",
            description: "Updated description",
            price: 300,
        };

        const updated = expectSuccess(await usecaseUser1.update(data));

        expect(updated).toMatchObject({
            uid: product.uid,
            categoryUID: data.categoryUID,
            name: data.name,
            description: data.description,
            price: data.price,
            updatedAt: updated.updatedAt,
            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(product.uid));

        expect(found).toMatchObject({
            uid: updated.uid,
            categoryUID: updated.categoryUID,
            name: updated.name,
            description: updated.description,
            price: updated.price,
            updatedAt: updated.updatedAt,
            updatedBy: user1.uid,
        });

        expect(found.updatedBy).not.toBe(user2.uid);
    });

    test("Should update only name", async () => {
        const product = await setupProduct(usecaseUser1, dataProduct1(category1UID));

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: product.uid,
                name: "New Product Name",
            })
        );

        expect(updated.name).toBe("New Product Name");
        expect(updated.categoryUID).toBe(category1UID);
        expect(updated.description).toBe(dataProduct1(category1UID).description);
        expect(updated.price).toBe(dataProduct1(category1UID).price);
    });

    test("Should update only description", async () => {
        const product = await setupProduct(usecaseUser1, dataProduct1(category1UID));

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: product.uid,
                description: "New product description",
            })
        );

        expect(updated.description).toBe("New product description");

        expect(updated.name).toBe(dataProduct1(category1UID).name);

        expect(updated.categoryUID).toBe(category1UID);
        expect(updated.price).toBe(dataProduct1(category1UID).price);
    });

    test("Should update only price", async () => {
        const product = await setupProduct(usecaseUser1, dataProduct1(category1UID));

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: product.uid,
                price: 250,
            })
        );

        expect(updated.price).toBe(250);
        expect(updated.name).toBe(dataProduct1(category1UID).name);
        expect(updated.description).toBe(dataProduct1(category1UID).description);
        expect(updated.categoryUID).toBe(category1UID);
    });

    test("Should update description to null", async () => {
        const product = await setupProduct(usecaseUser1, dataProduct1(category1UID));

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: product.uid,
                description: null,
            })
        );

        expect(updated.description).toBeNull();
    });

    test("Should update category", async () => {
        const product = await setupProduct(usecaseUser1, dataProduct1(category1UID));

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: product.uid,
                categoryUID: category2UID,
            })
        );

        expect(updated.categoryUID).toBe(category2UID);
    });

    test("Should not update an inexistent product", async () => {
        expectFailure(
            await usecaseUser1.update({
                uid: "invalid-product",
                name: "Product",
            }),
            ProductNotFoundError
        );
    });

    test("Should not update product from another platform", async () => {
        const product = await setupProduct(usecaseUser1, dataProduct1(category1UID));

        expectFailure(
            await usecaseUser2.update({
                uid: product.uid,
                name: "Updated",
            }),
            ProductNotFoundError
        );
    });

    test("Should not update to a duplicated product name", async () => {
        const product1 = await setupProduct(usecaseUser1, dataProduct1(category1UID));

        const product2 = await setupProduct(usecaseUser1, dataProduct2(category1UID));

        expectFailure(
            await usecaseUser1.update({
                uid: product2.uid,
                name: product1.name,
            }),
            ProductAlreadyExistsError
        );
    });

    test("Should not update to an inexistent category", async () => {
        const product = await setupProduct(usecaseUser1, dataProduct1(category1UID));

        expectFailure(
            await usecaseUser1.update({
                uid: product.uid,
                categoryUID: "invalid-category",
            }),
            CategoryNotFoundError
        );
    });

    test("Should not update to a category from another platform", async () => {
        const category = await setupProductCategory(categoryUsecaseUser2, dataCategory2);

        const product = await setupProduct(usecaseUser1, dataProduct1(category1UID));

        expectFailure(
            await usecaseUser1.update({
                uid: product.uid,
                categoryUID: category.uid,
            }),
            CategoryNotFoundError
        );
    });
});

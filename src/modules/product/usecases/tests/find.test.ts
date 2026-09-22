import { CategoryUsecase } from "@/modules/category/usecases/category.usecase";
import {
    dataCategory1,
    dataCategory2,
} from "@/modules/category/usecases/tests/factories/category-data.factory";
import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { ProductUsecase } from "../product.usecase";
import { dataProduct1, dataProduct2 } from "./factories/product-data.factory";
import { setupProductCategory } from "./setup/category-product.setup";
import { scenario } from "./setup/product.builder";
import { setupProduct, setupProducts } from "./setup/product.setup";

describe("ProductUsecase - find", () => {
    let usecaseUser1!: ProductUsecase;
    let usecaseUser2!: ProductUsecase;

    let categoryUsecaseUser1!: CategoryUsecase;

    let user1!: AuthUser;

    let categoryUID1!: string;
    let categoryUID2!: string;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            categoryUsecases: [categoryUsecaseUser1],
            users: [user1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        const category1 = await setupProductCategory(categoryUsecaseUser1, dataCategory1);

        const category2 = await setupProductCategory(categoryUsecaseUser1, dataCategory2);

        categoryUID1 = category1.uid;
        categoryUID2 = category2.uid;
    });

    test("Should find all platform products", async () => {
        await setupProducts(usecaseUser1, dataProduct1(categoryUID1), dataProduct2(categoryUID2));

        const products = expectSuccess(await usecaseUser1.find());

        expect(products.data.every((product) => product.platformUID === user1.platformUID)).toBe(
            true
        );
    });

    test("Should return empty list when platform has no products", async () => {
        const products = expectSuccess(await usecaseUser2.find());

        expect(products.data).toEqual([]);
    });

    test("Should filter products by name", async () => {
        await setupProducts(usecaseUser1, dataProduct1(categoryUID1), dataProduct2(categoryUID2));

        const products = expectSuccess(
            await usecaseUser1.find({
                name: dataProduct1(categoryUID1).name,
            })
        );

        expect(products.data).toHaveLength(1);
        expect(products.data[0].name).toBe(dataProduct1(categoryUID1).name);
    });

    test("Should search products by name", async () => {
        await setupProducts(
            usecaseUser1,
            {
                ...dataProduct1(categoryUID1),
                name: "Red Shirt",
            },
            {
                ...dataProduct2(categoryUID2),
                name: "Red Pants",
            }
        );

        const products = expectSuccess(
            await usecaseUser1.find({
                name: "Red",
            })
        );

        expect(products.data).toHaveLength(2);
        expect(products.data.every((product) => product.name.includes("Red"))).toBe(true);
    });

    test("Should filter products by category", async () => {
        const product1 = await setupProduct(usecaseUser1, dataProduct1(categoryUID1));

        await setupProduct(usecaseUser1, dataProduct2(categoryUID2));

        const products = expectSuccess(
            await usecaseUser1.find({
                categoryUID: categoryUID1,
            })
        );

        expect(products.data).toHaveLength(1);
        expect(products.data[0].uid).toBe(product1.uid);
        expect(products.data[0].categoryUID).toBe(categoryUID1);
    });

    test("Should return empty when filters match nothing", async () => {
        await setupProduct(usecaseUser1, dataProduct1(categoryUID1));

        const products = expectSuccess(
            await usecaseUser1.find({
                name: "Invalid Product",
            })
        );

        expect(products.data).toEqual([]);
    });

    test("Should order products by name ascending", async () => {
        const productB = await setupProduct(usecaseUser1, {
            ...dataProduct1(categoryUID1),
            name: "Banana",
        });

        const productA = await setupProduct(usecaseUser1, {
            ...dataProduct2(categoryUID2),
            name: "Apple",
        });

        const products = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "asc",
            })
        );

        expect(products.data.map((product) => product.uid)).toEqual([productA.uid, productB.uid]);
    });

    test("Should order products by name descending", async () => {
        const productB = await setupProduct(usecaseUser1, {
            ...dataProduct1(categoryUID1),
            name: "Banana",
        });

        const productA = await setupProduct(usecaseUser1, {
            ...dataProduct2(categoryUID2),
            name: "Apple",
        });

        const products = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "desc",
            })
        );

        expect(products.data.map((product) => product.uid)).toEqual([productB.uid, productA.uid]);
    });

    test("Should return first page", async () => {
        const [productA, productB] = await setupProducts(
            usecaseUser1,
            dataProduct1(categoryUID1),
            dataProduct2(categoryUID2),
            {
                ...dataProduct1(categoryUID1),
                name: "Product 3",
            },
            {
                ...dataProduct1(categoryUID1),
                name: "Product 4",
            }
        );

        const products = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(products.data).toHaveLength(2);

        expect(products.data.map((product) => product.uid)).toEqual([productA.uid, productB.uid]);
    });

    test("Should return second page", async () => {
        const [, , productC, productD] = await setupProducts(
            usecaseUser1,
            dataProduct1(categoryUID1),
            dataProduct2(categoryUID2),
            {
                ...dataProduct1(categoryUID1),
                name: "Product 3",
            },
            {
                ...dataProduct1(categoryUID1),
                name: "Product 4",
            }
        );

        const products = expectSuccess(
            await usecaseUser1.find({
                page: 2,
                limit: 2,
            })
        );

        expect(products.data.map((product) => product.uid)).toEqual([productC.uid, productD.uid]);
    });

    test("Should return remaining products on last page", async () => {
        const [, , , , productE] = await setupProducts(
            usecaseUser1,
            dataProduct1(categoryUID1),
            dataProduct2(categoryUID2),
            {
                ...dataProduct1(categoryUID1),
                name: "Product 3",
            },
            {
                ...dataProduct1(categoryUID1),
                name: "Product 4",
            },
            {
                ...dataProduct1(categoryUID1),
                name: "Product 5",
            }
        );

        const products = expectSuccess(
            await usecaseUser1.find({
                page: 3,
                limit: 2,
            })
        );

        expect(products.data.map((product) => product.uid)).toEqual([productE.uid]);
    });

    test("Should return empty list when page does not exist", async () => {
        await setupProducts(usecaseUser1, dataProduct1(categoryUID1), dataProduct2(categoryUID2));

        const products = expectSuccess(
            await usecaseUser1.find({
                page: 10,
                limit: 10,
            })
        );

        expect(products.data).toEqual([]);
    });

    test("Should filter and order products", async () => {
        const productB = await setupProduct(usecaseUser1, {
            ...dataProduct1(categoryUID1),
            name: "Banana",
        });

        const productA = await setupProduct(usecaseUser1, {
            ...dataProduct2(categoryUID2),
            name: "Apple",
        });

        await setupProduct(usecaseUser1, {
            ...dataProduct1(categoryUID1),
            name: "Orange",
        });

        const products = expectSuccess(
            await usecaseUser1.find({
                name: "a",
                orderBy: "name",
                order: "asc",
                page: 1,
                limit: 2,
            })
        );

        expect(products.data.map((product) => product.uid)).toEqual([productA.uid, productB.uid]);
    });

    test("Should order before paginate", async () => {
        await setupProduct(usecaseUser1, {
            ...dataProduct1(categoryUID1),
            name: "A",
        });

        await setupProduct(usecaseUser1, {
            ...dataProduct1(categoryUID1),
            name: "B",
        });

        const productC = await setupProduct(usecaseUser1, {
            ...dataProduct1(categoryUID1),
            name: "C",
        });

        const productD = await setupProduct(usecaseUser1, {
            ...dataProduct1(categoryUID1),
            name: "D",
        });

        const products = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "asc",
                page: 2,
                limit: 2,
            })
        );

        expect(products.data.map((product) => product.uid)).toEqual([productC.uid, productD.uid]);
    });

    test("Should filter, order and paginate products", async () => {
        const productB = await setupProduct(usecaseUser1, {
            ...dataProduct1(categoryUID1),
            name: "Banana",
        });

        const productA = await setupProduct(usecaseUser1, {
            ...dataProduct2(categoryUID2),
            name: "Apple",
        });

        await setupProduct(usecaseUser1, {
            ...dataProduct1(categoryUID1),
            name: "Orange",
        });

        const products = expectSuccess(
            await usecaseUser1.find({
                name: "a",
                orderBy: "name",
                order: "asc",
                page: 1,
                limit: 2,
            })
        );

        expect(products.data.map((product) => product.uid)).toEqual([productA.uid, productB.uid]);
    });

    test("Should filter, order and paginate products by category", async () => {
        const productB = await setupProduct(usecaseUser1, {
            ...dataProduct1(categoryUID1),
            name: "Banana",
        });

        const productA = await setupProduct(usecaseUser1, {
            ...dataProduct1(categoryUID1),
            name: "Apple",
        });

        await setupProduct(usecaseUser1, {
            ...dataProduct2(categoryUID2),
            name: "Orange",
        });

        const products = expectSuccess(
            await usecaseUser1.find({
                categoryUID: categoryUID1,
                orderBy: "name",
                order: "asc",
                page: 1,
                limit: 2,
            })
        );

        expect(products.data.map((product) => product.uid)).toEqual([productA.uid, productB.uid]);
    });
});

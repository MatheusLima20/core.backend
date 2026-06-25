import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateProductDTO } from "../../dtos/create-product.dto";
import { UpdateProductDTO } from "../../dtos/update-product.dto";
import { ProductAlreadyExistsError } from "../../errors/product-already-exists.error";
import { ProductNotFoundError } from "../../errors/product-not-found.error";
import { ProductUsecase } from "../product.usecase";
import { scenario } from "./core/test-factory";
import {
    expectCreateProductFailure,
    setupProduct,
    setupProducts,
} from "./helpers/product.helper";

describe("ProductUsecase", () => {
    const dataProduct1: CreateProductDTO = {
        name: "Why Protein.",
        description: "Supplementation Food.",
        isForSale: true,
        isOnSale: false,
        currentPrice: 10,
        amount: 20,
    };

    const dataProduct2: CreateProductDTO = {
        ...dataProduct1,
        name: "Creatine",
        currentPrice: 15,
        amount: 5,
    };

    const makeProduct = (
        data?: Partial<CreateProductDTO>,
    ): CreateProductDTO => ({
        ...dataProduct1,
        ...data,
    });

    let usecaseUser1!: ProductUsecase;
    let usecaseUser2!: ProductUsecase;

    let user1: AuthUser;
    let user2: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should register a product", async () => {
        const [productCreatedA, productCreatedB] = await Promise.all([
            setupProduct(usecaseUser1, dataProduct1),
            setupProduct(usecaseUser2, dataProduct2),
        ]);

        expect(productCreatedA).toMatchObject({
            name: dataProduct1.name,
            description: dataProduct1.description,
            currentPrice: dataProduct1.currentPrice,
            amount: dataProduct1.amount,
            platformUID: user1.platformUID,
            isForSale: dataProduct1.isForSale,
            isOnSale: dataProduct1.isOnSale,
            createdBy: user1.uid,
            uid: expect.any(String),
        });

        expect(productCreatedB).toMatchObject({
            name: dataProduct2.name,
            description: dataProduct2.description,
            currentPrice: dataProduct2.currentPrice,
            amount: dataProduct2.amount,
            isForSale: dataProduct2.isForSale,
            isOnSale: dataProduct2.isOnSale,
            platformUID: user2.platformUID,
            createdBy: user2.uid,
            uid: expect.any(String),
        });
    });

    test("Should allow same product name in different platforms", async () => {
        await setupProduct(usecaseUser1, dataProduct1);

        await setupProduct(usecaseUser2, dataProduct1);
    });

    test("Should not register duplicated product", async () => {
        await setupProduct(usecaseUser1, dataProduct1);
        await expectCreateProductFailure(
            usecaseUser1,
            dataProduct1,
            ProductAlreadyExistsError,
        );
    });

    test("Should update a product", async () => {
        const [productCreatedA] = await setupProducts(
            usecaseUser1,
            dataProduct1,
            dataProduct2,
        );

        const mergedProduct: UpdateProductDTO = {
            ...dataProduct1,
            uid: productCreatedA.uid,
            description: "Why Sale. Fifty percent off.",
            currentPrice: 7.5,
        };

        const productUpdated = expectSuccess(
            await usecaseUser1.update(mergedProduct),
        );

        expect(productUpdated).toMatchObject({
            uid: productCreatedA.uid,
            description: mergedProduct.description,
            currentPrice: mergedProduct.currentPrice,
            isForSale: mergedProduct.isForSale,
            isOnSale: mergedProduct.isOnSale,
            amount: mergedProduct.amount,
            updatedBy: user1.uid,
        });

        const foundProduct = expectSuccess(
            await usecaseUser1.findByUID(productUpdated.uid),
        );

        expect(foundProduct).toMatchObject({
            uid: productUpdated.uid,
            description: productUpdated.description,
            currentPrice: productUpdated.currentPrice,
            isForSale: productUpdated.isForSale,
            isOnSale: productUpdated.isOnSale,
            amount: productUpdated.amount,
            updatedBy: user1.uid,
        });
    });

    test("Should update product keeping the same name", async () => {
        const product = await setupProduct(usecaseUser1, dataProduct1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...product,
                description: "Updated",
            }),
        );

        expect(updated.name).toBe(product.name);
    });

    test("Should not update duplicated product", async () => {
        const [productCreatedA] = await setupProducts(
            usecaseUser1,
            dataProduct1,
            dataProduct2,
        );

        const mergedProduct: UpdateProductDTO = {
            ...productCreatedA,
            name: dataProduct2.name,
            description: "Why Sale. Fifty percent off.",
            currentPrice: 7.5,
        };

        expectFailure(
            await usecaseUser1.update(mergedProduct),
            ProductAlreadyExistsError,
        );
    });

    test("Should find a product by uid", async () => {
        const [, , productCreatedC] = await setupProducts(
            usecaseUser1,
            dataProduct1,
            dataProduct2,
            makeProduct({
                name: "Halters 10KG",
                description: "Buy a gym equipment to training arms.",
                currentPrice: 20,
                amount: 2,
            }),
        );

        const foundProduct = expectSuccess(
            await usecaseUser1.findByUID(productCreatedC.uid),
        );

        expect(foundProduct).toMatchObject({
            uid: productCreatedC.uid,
            name: productCreatedC.name,
            description: productCreatedC.description,
            currentPrice: productCreatedC.currentPrice,
            amount: productCreatedC.amount,
            isForSale: productCreatedC.isForSale,
            isOnSale: productCreatedC.isOnSale,
            platformUID: productCreatedC.platformUID,
            createdBy: productCreatedC.createdBy,
            createdAt: productCreatedC.createdAt,
        });
    });

    test("Should throw when product uid does not exist", async () => {
        expectFailure(
            await usecaseUser1.findByUID("777"),
            ProductNotFoundError,
        );
    });

    test("Should find all platform products", async () => {
        await setupProducts(usecaseUser1, dataProduct1, dataProduct2);
        await setupProduct(
            usecaseUser2,
            makeProduct({
                name: "Halters",
                description: "Buy a gym equipment to training arms.",
                amount: 2,
            }),
        );

        const platform1Products = expectSuccess(await usecaseUser1.find());
        const platform2Products = expectSuccess(await usecaseUser2.find());

        expect(
            platform1Products.every(
                (platformProducts) =>
                    platformProducts.platformUID === user1.platformUID,
            ),
        ).toBe(true);

        expect(
            platform2Products.every(
                (platformProducts) =>
                    platformProducts.platformUID === user2.platformUID,
            ),
        ).toBe(true);
    });

    test("Should return an empty list when platform has no products", async () => {
        const products = expectSuccess(await usecaseUser2.find());

        expect(products).toEqual([]);
    });

    test("Should filter products by name", async () => {
        await setupProducts(
            usecaseUser1,
            makeProduct({ name: "Whey" }),
            makeProduct({ name: "Creatine" }),
            makeProduct({ name: "Whey Isolate" }),
        );

        const products = expectSuccess(
            await usecaseUser1.find({
                name: "Whey",
            }),
        );

        expect(products).toHaveLength(2);

        expect(products.every((product) => product.name.includes("Whey"))).toBe(
            true,
        );
    });

    test("Should filter products by description", async () => {
        await setupProducts(usecaseUser1, dataProduct1, {
            ...dataProduct2,
            description: "Other Product",
        });

        const products = expectSuccess(
            await usecaseUser1.find({
                description: "Supplementation",
            }),
        );

        expect(products).toHaveLength(1);
    });

    test("Should search all products by name and description", async () => {
        const [, , createdProductA, createdProductB] = await setupProducts(
            usecaseUser2,
            dataProduct1,
            dataProduct2,
            makeProduct({
                name: "Halter 2KG",
                description: "Buy a gym equipment to training arms.",
                amount: 2,
            }),
            makeProduct({
                name: "Halter 5KG",
                description: "Buy a gym equipment to training arms.",
                amount: 2,
            }),
        );

        const foundProducts = expectSuccess(
            await usecaseUser2.find({
                name: "Halter",
                description: "arms",
            }),
        );

        expect(
            foundProducts.every((product) => product.name.includes("Halter")),
        ).toBe(true);

        expect(foundProducts).toHaveLength(2);

        expect(foundProducts).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: createdProductA.name,
                }),
                expect.objectContaining({
                    name: createdProductB.name,
                }),
            ]),
        );
    });

    test("Should return empty when filters match nothing", async () => {
        await setupProduct(
            usecaseUser1,
            makeProduct({
                name: "Creatine",
            }),
        );

        const products = expectSuccess(
            await usecaseUser1.find({
                name: "Banana",
            }),
        );

        expect(products).toEqual([]);
    });

    test("Should order products by name ascending.", async () => {
        await setupProducts(
            usecaseUser1,
            makeProduct({ name: "Whey C" }),
            makeProduct({ name: "Whey A" }),
            makeProduct({ name: "Whey B" }),
        );

        const products = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "asc",
            }),
        );

        expect(products.map((product) => product.name)).toEqual([
            "Whey A",
            "Whey B",
            "Whey C",
        ]);
    });

    test("Should order products by name descending.", async () => {
        await setupProducts(
            usecaseUser1,
            makeProduct({ name: "A" }),
            makeProduct({ name: "C" }),
            makeProduct({ name: "B" }),
        );

        const products = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "desc",
            }),
        );

        expect(products.map((product) => product.name)).toEqual([
            "C",
            "B",
            "A",
        ]);
    });

    test("Should return first page.", async () => {
        const [productA, productB] = await setupProducts(
            usecaseUser1,
            makeProduct({ name: "A" }),
            makeProduct({ name: "B" }),
            makeProduct({ name: "C" }),
            makeProduct({ name: "D" }),
            makeProduct({ name: "E" }),
            makeProduct({ name: "F" }),
            makeProduct({ name: "G" }),
        );

        const products = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            }),
        );

        expect(products).toHaveLength(2);

        expect(products.map((product) => product.name)).toEqual([
            productA.name,
            productB.name,
        ]);
    });

    test("Should return second page.", async () => {
        const [, , productC, productD] = await setupProducts(
            usecaseUser1,
            makeProduct({ name: "A" }),
            makeProduct({ name: "B" }),
            makeProduct({ name: "C" }),
            makeProduct({ name: "D" }),
            makeProduct({ name: "E" }),
            makeProduct({ name: "F" }),
            makeProduct({ name: "G" }),
        );

        const products = expectSuccess(
            await usecaseUser1.find({
                page: 2,
                limit: 2,
            }),
        );

        expect(products).toHaveLength(2);

        expect(products.map((product) => product.name)).toEqual([
            productC.name,
            productD.name,
        ]);
    });

    test("Should return remaining products on last page.", async () => {
        const [, , , , productE] = await setupProducts(
            usecaseUser1,
            makeProduct({ name: "Creatine A" }),
            makeProduct({ name: "Creatine B" }),
            makeProduct({ name: "Creatine C" }),
            makeProduct({ name: "Creatine D" }),
            makeProduct({ name: "Creatine E" }),
        );

        const products = expectSuccess(
            await usecaseUser1.find({
                page: 3,
                limit: 2,
            }),
        );

        expect(products.map((product) => product.name)).toEqual([
            productE.name,
        ]);
    });

    test("Should return empty list when page does not exist.", async () => {
        await setupProducts(usecaseUser1, makeProduct(), makeProduct());

        const products = expectSuccess(
            await usecaseUser1.find({
                page: 5,
                limit: 10,
            }),
        );

        expect(products).toEqual([]);
    });

    test("Should filter and order products", async () => {
        const [productB, , productA] = await setupProducts(
            usecaseUser1,
            makeProduct({ name: "Whey B" }),
            makeProduct({ name: "Creatine" }),
            makeProduct({ name: "Whey A" }),
        );

        const products = expectSuccess(
            await usecaseUser1.find({
                name: "Whey",
                orderBy: "name",
                order: "asc",
            }),
        );

        expect(products.map((product) => product.name)).toEqual([
            productA.name,
            productB.name,
        ]);
    });

    test("Should order before paginate", async () => {
        const [productD, , , productC] = await setupProducts(
            usecaseUser1,
            makeProduct({ name: "Whey D" }),
            makeProduct({ name: "Whey A" }),
            makeProduct({ name: "Whey E" }),
            makeProduct({ name: "Whey C" }),
            makeProduct({ name: "Whey B" }),
        );

        const products = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "asc",
                page: 2,
                limit: 2,
            }),
        );

        expect(products.map((product) => product.name)).toEqual([
            productC.name,
            productD.name,
        ]);
    });

    test("Should filter, order and paginate products", async () => {
        const [productD, , , productC] = await setupProducts(
            usecaseUser1,
            makeProduct({ name: "Whey D" }),
            makeProduct({ name: "Whey E" }),
            makeProduct({ name: "Whey A" }),
            makeProduct({ name: "Whey C" }),
            makeProduct({ name: "Whey B" }),
        );

        const products = expectSuccess(
            await usecaseUser1.find({
                name: "Whey",
                orderBy: "name",
                order: "asc",
                page: 2,
                limit: 2,
            }),
        );

        expect(products.map((product) => product.name)).toEqual([
            productC.name,
            productD.name,
        ]);
    });

    test("Should empty products.", async () => {
        expectSuccess(await usecaseUser2.find());
    });

    test("Should to delete a product.", async () => {
        const [createdProductA] = await setupProducts(
            usecaseUser1,
            dataProduct1,
            dataProduct2,
        );

        const productBefore = expectSuccess(await usecaseUser1.find());

        expectSuccess(await usecaseUser1.delete(createdProductA.uid));

        const productAfter = expectSuccess(await usecaseUser1.find());

        expect(productBefore.length).not.toEqual(productAfter.length);

        expectFailure(
            await usecaseUser1.findByUID(createdProductA.uid),
            ProductNotFoundError,
        );
    });
});

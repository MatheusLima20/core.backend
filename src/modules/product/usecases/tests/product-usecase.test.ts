import { AuthUser } from "@/shared/context/auth.user";
import { CreateProductDTO } from "../../dtos/create-product.dto";
import { UpdateProductDTO } from "../../dtos/update-product.dto";
import { ProductUsecase } from "../product.usecase";
import { scenario } from "./core/test-factory";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";
import { ProductAlreadyExistsError } from "../../errors/product-already-exists.error";
import { ProductNotFoundError } from "../../errors/product-not-found.error";

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
        const [productCreatedA, productCreatedB] = (
            await Promise.all([
                usecaseUser1.create(dataProduct1),
                usecaseUser2.create(dataProduct2),
            ])
        ).map(expectSuccess);

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
        await usecaseUser1.create(dataProduct1);

        expectSuccess(await usecaseUser2.create(dataProduct1));
    });

    test("Should not register duplicated product", async () => {
        await usecaseUser1.create(dataProduct1);
        expectFailure(
            await usecaseUser1.create(dataProduct1),
            ProductAlreadyExistsError,
        );
    });

    test("Should update a product", async () => {
        const productCreatedA = expectSuccess(
            await usecaseUser1.create(dataProduct1),
        );
        await usecaseUser1.create(dataProduct2);

        const mergedProduct: UpdateProductDTO = {
            ...dataProduct1,
            uid: productCreatedA.uid,
            description: "Why Sale. Fifty percent off.",
            currentPrice: 7.5,
            updatedBy: user1.uid,
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

    test("Should not update duplicated product", async () => {
        const productCreatedA = expectSuccess(
            await usecaseUser1.create(dataProduct1),
        );
        await usecaseUser1.create(dataProduct2);

        const mergedProduct: UpdateProductDTO = {
            ...productCreatedA,
            name: dataProduct2.name,
            description: "Why Sale. Fifty percent off.",
            currentPrice: 7.5,
            updatedBy: "1",
        };

        expectFailure(
            await usecaseUser1.update(mergedProduct),
            ProductAlreadyExistsError,
        );
    });

    test("Should find a product by uid", async () => {
        await usecaseUser1.create(dataProduct1);
        await usecaseUser1.create(dataProduct2);
        const productCreatedC = expectSuccess(
            await usecaseUser1.create(
                makeProduct({
                    name: "Halters 10KG",
                    description: "Buy a gym equipment to training arms.",
                    currentPrice: 20,
                    amount: 2,
                }),
            ),
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
        await usecaseUser1.create(dataProduct1);
        await usecaseUser1.create(dataProduct2);
        await usecaseUser2.create(
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

    test("Should find product by name", async () => {
        await usecaseUser2.create(dataProduct1);
        await usecaseUser2.create(dataProduct2);
        const createdProduct = expectSuccess(
            await usecaseUser2.create(
                makeProduct({
                    name: "Halter",
                    description: "Buy a gym equipment to training arms.",
                    amount: 2,
                }),
            ),
        );

        const foundProduct = expectSuccess(
            await usecaseUser2.findByName(createdProduct.name),
        );

        expect(foundProduct).toMatchObject({
            uid: createdProduct.uid,
            name: createdProduct.name,
            description: createdProduct.description,
            platformUID: user2.platformUID,
            currentPrice: createdProduct.currentPrice,
            isForSale: createdProduct.isForSale,
            isOnSale: createdProduct.isOnSale,
            amount: createdProduct.amount,
            createdBy: user2.uid,
            createdAt: createdProduct.createdAt,
        });
    });

    test("Should search all products by name and description", async () => {
        await usecaseUser2.create(dataProduct1);
        await usecaseUser2.create(dataProduct2);
        const createdProductA = expectSuccess(
            await usecaseUser2.create(
                makeProduct({
                    name: "Halter 2KG",
                    description: "Buy a gym equipment to training arms.",
                    amount: 2,
                }),
            ),
        );

        const createdProductB = expectSuccess(
            await usecaseUser2.create(
                makeProduct({
                    name: "Halter 5KG",
                    description: "Buy a gym equipment to training arms.",
                    amount: 2,
                }),
            ),
        );

        const foundProducts = expectSuccess(
            await usecaseUser2.search({
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

    test("Should to delete a product", async () => {
        const createdProductA = expectSuccess(
            await usecaseUser1.create(dataProduct1),
        );
        await usecaseUser1.create(dataProduct2);

        const productBefore = expectSuccess(await usecaseUser1.find());

        expectSuccess(await usecaseUser1.delete(createdProductA.uid));

        const productAfter = expectSuccess(await usecaseUser1.find());

        expect(productBefore.length).not.toEqual(productAfter.length);

        expectFailure(
            await usecaseUser1.findByUID(createdProductA.uid),
            ProductNotFoundError,
        );
    });

    test("Should not find products from another platform", async () => {
        const product = expectSuccess(await usecaseUser1.create(dataProduct1));
        expectFailure(
            await usecaseUser2.findByUID(product.uid),
            ProductNotFoundError,
        );
    });
});

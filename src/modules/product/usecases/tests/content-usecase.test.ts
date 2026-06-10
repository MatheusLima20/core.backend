import { CreateProductDTO } from "../../dtos/create-product.dto";
import { UpdateProductDTO } from "../../dtos/update-product.dto";
import { InMemoryProductRepository } from "../../repositories/implementations/in-memory-product.repository";
import { ProductUsecase } from "../product.usecase";

describe("ProductUsecase", () => {
    const product: CreateProductDTO = {
        platformUID: "1",
        name: "Why Protein.",
        description: "Supplementation Food.",
        isForSale: true,
        isOnSale: false,
        currentPrice: 10,
        amount: 20,
        createdBy: "1",
    };

    const product2: CreateProductDTO = {
        ...product,
        name: "Creatine",
        currentPrice: 15,
        amount: 5,
    };

    const makeProduct = (
        data?: Partial<CreateProductDTO>,
    ): CreateProductDTO => ({
        ...product,
        ...data,
    });

    let repository: InMemoryProductRepository;

    let usecase: ProductUsecase;

    beforeEach(() => {
        repository = new InMemoryProductRepository();

        usecase = new ProductUsecase(repository);
    });

    test("Should register a product", async () => {
        const result = await usecase.create(product);
        const result2 = await usecase.create(product2);

        expect(product.description).toBe(result.description);
        expect(product2.description).toBe(result2.description);
    });

    test("Should not register duplicated product", async () => {
        await usecase.create(product);

        await expect(usecase.create(product)).rejects.toThrow();
    });

    test("Should update a product", async () => {
        const result = await usecase.create(product);
        await usecase.create(product2);

        const mergedProduct: UpdateProductDTO = {
            ...product,
            uid: result.uid,
            description: "Why Sale. Fifty percent off.",
            currentPrice: 7.5,
            updatedBy: "1",
        };

        const resultUpdated = await usecase.update(mergedProduct);

        expect(mergedProduct.currentPrice).toBe(resultUpdated.currentPrice);
        expect(mergedProduct.uid).toBe(resultUpdated.uid);
    });

    test("Should not update duplicated name product", async () => {
        const result = await usecase.create(product);
        await usecase.create(product2);

        const mergedProduct: UpdateProductDTO = {
            ...product,
            uid: result.uid,
            name: product2.name,
            description: "Why Sale. Fifty percent off.",
            currentPrice: 7.5,
            updatedBy: "1",
        };

        await expect(usecase.update(mergedProduct)).rejects.toThrow();
    });

    test("Should find a product by uid", async () => {
        await usecase.create(product);
        await usecase.create(product2);
        const createResult = await usecase.create(
            makeProduct({
                name: "Halters 10KG",
                description: "Buy a gym equipment to training arms.",
                currentPrice: 20,
                amount: 2,
            }),
        );

        const resultFind = await usecase.findByUID(createResult.uid);

        expect(createResult.uid).toBe(resultFind.uid);
    });

    test("Should return throw when product uid does not exist", async () => {
        await usecase.create(product);
        await usecase.create(product2);
        const createResult = await usecase.create(
            makeProduct({
                name: "Halters 10KG",
                description: "Buy a gym equipment to training arms.",
                currentPrice: 20,
                amount: 2,
            }),
        );

        await expect(usecase.findByUID("777")).rejects.toThrow();
    });

    test("Should find all platform products", async () => {
        await usecase.create(product);
        await usecase.create(product2);
        await usecase.create(
            makeProduct({
                name: "Halters",
                description: "Buy a gym equipment to training arms.",
                amount: 2,
                platformUID: "2",
            }),
        );

        const result = await usecase.find("1");
        const result2 = await usecase.find("2");

        expect(result.every((product) => product.platformUID === "1")).toBe(
            true,
        );
        expect(result2.every((product) => product.platformUID === "2")).toBe(
            true,
        );

        expect(result).toHaveLength(3);
        expect(result2).toHaveLength(1);
    });

    test("Should find product by name", async () => {
        await usecase.create(product);
        await usecase.create(product2);
        const createResult = await usecase.create(
            makeProduct({
                name: "Halter",
                description: "Buy a gym equipment to training arms.",
                amount: 2,
                platformUID: "2",
            }),
        );

        const result = await usecase.findByName(
            createResult.name,
            createResult.platformUID,
        );

        expect(result.uid).toBe(createResult.uid);
    });

    test("Should search all products by name and description", async () => {
        await usecase.create(product);
        await usecase.create(product2);
        const createResult = await usecase.create(
            makeProduct({
                name: "Halter 2KG",
                description: "Buy a gym equipment to training arms.",
                amount: 2,
                platformUID: "2",
            }),
        );

        await usecase.create(
            makeProduct({
                name: "Halter 5KG",
                description: "Buy a gym equipment to training arms.",
                amount: 2,
                platformUID: "2",
            }),
        );

        const result = await usecase.search({
            name: "Halter",
            platformUID: createResult.platformUID,
        });

        expect(
            result.every(
                (product) => product.platformUID === createResult.platformUID,
            ),
        ).toBe(true);

        expect(result).toHaveLength(2);
    });

    test("Should to delete a product", async () => {
        const result = await usecase.create(product);
        await usecase.create(product2);

        const productBefore = await usecase.find(product.platformUID);

        const isDeletedProduct = await usecase.delete(result.uid);

        const productAfter = await usecase.find(product.platformUID);

        expect(isDeletedProduct).toBe(true);
        expect(productBefore.length).not.toEqual(productAfter.length);
    });
});

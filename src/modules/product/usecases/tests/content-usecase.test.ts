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
        price: 10,
        amount: 20,
        createdBy: "1",
    };

    const product2: CreateProductDTO = {
        ...product,
        name: "Creatine",
        price: 15,
        amount: 5,
    };

    const makeProduct = (
        data?: Partial<CreateProductDTO>,
    ): CreateProductDTO => ({
        ...product,
        ...data,
    });

    let repository: InMemoryProductRepository;

    let useCase: ProductUsecase;

    beforeEach(() => {
        repository = new InMemoryProductRepository();

        useCase = new ProductUsecase(repository);
    });

    test("Should register a product", async () => {
        const result = await useCase.create(product);
        const result2 = await useCase.create(product2);

        expect(product.description).toBe(result.description);
        expect(product2.description).toBe(result2.description);
    });

    test("Should update a product", async () => {
        const result = await useCase.create(product);
        await useCase.create(product2);

        const mergedProduct: UpdateProductDTO = {
            ...product2,
            uid: result.uid,
            description: "Creatine Sale. Fifty percent off.",
            price: 7.5,
            updatedBy: "1",
        };

        const resultUpdated = await useCase.update(mergedProduct);

        expect(mergedProduct.price).toBe(resultUpdated.price);
        expect(mergedProduct.uid).toBe(resultUpdated.uid);
    });

    test("Should find a product by uid", async () => {
        await useCase.create(product);
        await useCase.create(product2);
        const createResult = await useCase.create(
            makeProduct({
                name: "Halters 10KG",
                description: "Buy a gym equipment to training arms.",
                price: 20,
                amount: 2,
            }),
        );

        const resultFind = await useCase.findByUID(createResult.uid);

        expect(createResult.uid).toBe(resultFind.uid);
    });

    test("Should find all platform products", async () => {
        await useCase.create(product);
        await useCase.create(product2);
        await useCase.create(
            makeProduct({
                name: "Halters",
                description: "Buy a gym equipment to training arms.",
                amount: 2,
                platformUID: "2",
            }),
        );

        const result = await useCase.find("1");
        const result2 = await useCase.find("2");

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
        await useCase.create(product);
        await useCase.create(product2);
        const createResult = await useCase.create(
            makeProduct({
                name: "Halter",
                description: "Buy a gym equipment to training arms.",
                amount: 2,
                platformUID: "2",
            }),
        );

        const result = await useCase.findByName(
            createResult.name,
            createResult.platformUID,
        );

        expect(result.uid).toBe(createResult.uid);
    });

    test("Should search all products by name and description", async () => {
        await useCase.create(product);
        await useCase.create(product2);
        const createResult = await useCase.create(
            makeProduct({
                name: "Halter 2KG",
                description: "Buy a gym equipment to training arms.",
                amount: 2,
                platformUID: "2",
            }),
        );

        await useCase.create(
            makeProduct({
                name: "Halter 5KG",
                description: "Buy a gym equipment to training arms.",
                amount: 2,
                platformUID: "2",
            }),
        );

        const result = await useCase.search({
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

    test("Should to delete a content", async () => {
        const result = await useCase.create(product);
        await useCase.create(product2);

        const contentsBefore = await useCase.find(product.platformUID);

        const isDeletedContent = await useCase.delete(result.uid);

        const contentsAfter = await useCase.find(product.platformUID);

        expect(isDeletedContent).toBe(true);
        expect(contentsBefore.length).not.toEqual(contentsAfter.length);
    });
});

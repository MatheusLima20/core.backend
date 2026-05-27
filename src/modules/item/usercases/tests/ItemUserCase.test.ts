import { ItemUseCase } from "../ItemUseCase";
import { CreateItemDTO } from "../../dtos/create-item.dto";
import { InMemoryItemRepository } from "../../repositories/implementations/InMemoryItemRepository";

const item: CreateItemDTO = {
    orderId: "1",
    platform: 1,
    name: "Seat",
    description: "Secretary Seat",
    value: 50,
};

const item2: CreateItemDTO = {
    ...item,
    name: 'Seat1'
};

describe("InMemoryItem", () => {
    test("Should register item just once item.register", async () => {
        const repository = new InMemoryItemRepository();

        const useCase = new ItemUseCase(repository);

        const result = await useCase.execute(item);
        const result1 = await useCase.execute(item2);

        expect(result.name).toBe(item.name);
        expect(result1.name).toBe(item2.name);
    });

    test("Should find item by id item.find.uid", async () => {
        const repository = new InMemoryItemRepository();

        const useCase = new ItemUseCase(repository);

        const resultCreated = await useCase.execute(item);

        const result = await useCase.findByUId(resultCreated?.uid);

        expect(result.uid).toBe(resultCreated.uid);
    });

    test("Should find item by name item.find.name", async () => {
        const repository = new InMemoryItemRepository();

        const useCase = new ItemUseCase(repository);

        await useCase.execute(item);

        const result = await useCase.findByName("Seat");

        expect(result.name).toBe("Seat");
    });
});

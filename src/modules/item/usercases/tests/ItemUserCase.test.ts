import { ItemUseCase } from "../ItemUseCase";
import { CreateItemDTO } from "../../dtos/create-item.dto";
import { InMemoryItemRepository } from "../../repositories/implementations/InMemoryItemRepository";
import { UpdateItemDTO } from "../../dtos/update-item.dto";

const item: CreateItemDTO = {
    orderId: "1",
    platform: 1,
    name: "Seat",
    description: "Secretary Seat",
    value: 50,
};

const item2: CreateItemDTO = {
    ...item,
    name: "Seat1",
};

const makeItem = (data?: Partial<CreateItemDTO>): CreateItemDTO => ({
    orderId: "1",
    platform: 1,
    name: "Seat",
    description: "Secretary Seat",
    value: 50,
    ...data,
});

describe("ItemUserCase", () => {
    let repository: InMemoryItemRepository;

    let useCase: ItemUseCase;

    beforeEach(() => {
        repository = new InMemoryItemRepository();

        useCase = new ItemUseCase(repository);
    });

    test("Should register an item", async () => {
        const result = await useCase.create(item);
        const result1 = await useCase.create(item2);

        expect(result.name).toBe(item.name);
        expect(result1.name).toBe(item2.name);
    });

    test("Should find an item by id", async () => {
        const resultCreated = await useCase.create(item);

        const result = await useCase.findByUID(resultCreated?.uid);

        expect(result.uid).toBe(resultCreated.uid);
    });

    test("Should find an item by name item", async () => {
        await useCase.create(item);

        const result = await useCase.findByName("Seat");

        expect(result.name).toBe("Seat");
    });

    test("Should update an existing item", async () => {
        await useCase.create(
            makeItem({
                name: "Fridge",
                description: "Fridge to the main room.",
                orderId: "1",
            }),
        );
        await useCase.create(item2);
        const resultItem = await useCase.create(item);

        const newItem: UpdateItemDTO = {
            name: "Table",
            description: "Secretary Table",
            value: 100,
            orderId: resultItem.orderId,
            uid: resultItem.uid,
        };

        const itemUpdated = await useCase.update(newItem);

        expect(itemUpdated.name).toBe("Table");
    });

    test("Should return same order existing items", async () => {
        await useCase.create(item2);
        await useCase.create(item);

        await useCase.create(
            makeItem({
                name: "Fridge",
                description: "Fridge to the main room.",
                orderId: "2",
            }),
        );

        const items = await useCase.findByOrderUID(item.orderId);

        expect(items).toHaveLength(2);

        expect(items.every((item) => item.orderId === item2.orderId)).toBe(
            true,
        );
    });

    test("Should to delete an item", async () => {
        const seat = await useCase.create(item);
        await useCase.create(item2);

        const fridge = await useCase.create(
            makeItem({
                name: "Fridge",
                description: "Fridge to the main room.",
                orderId: "2",
            }),
        );

        const isDeletedFridge = await useCase.delete(fridge.uid);
        const isDeletedSeat = await useCase.delete(seat.uid);

        expect(isDeletedSeat).toBe(true);
        expect(isDeletedFridge).toBe(true);
    });
});

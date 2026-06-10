import { ItemUsecase } from "../item.usecase";
import { CreateOrderItemDTO } from "../../dtos/create-order-item.dto";
import { InMemoryOrderItemRepository } from "../../repositories/implementations/in-memory-item.repository";
import { UpdateOrderItemDTO } from "../../dtos/update-order-item.dto";
import { InMemoryOrderRepository } from "@/modules/order/repositories/implementations/in-memory-order.repository";

const item: CreateOrderItemDTO = {
    orderUID: "1",
    platformUID: "1",
    unitPrice: 50,
    productUID: "1",
    amount: 15,
};

const item2: CreateOrderItemDTO = {
    ...item,
};

const makeItem = (data?: Partial<CreateOrderItemDTO>): CreateOrderItemDTO => ({
    productUID: "1",
    orderUID: "1",
    platformUID: "1",
    amount: 10,
    unitPrice: 50,
    ...data,
});

describe("ItemUsecase", () => {
    let itemRepository: InMemoryOrderItemRepository;

    let orderRepository: InMemoryOrderRepository;

    let usecase: ItemUsecase;

    beforeEach(() => {
        itemRepository = new InMemoryOrderItemRepository();
        orderRepository = new InMemoryOrderRepository();

        usecase = new ItemUsecase(itemRepository, orderRepository);
    });

    test("Should register an item", async () => {
        const result = await usecase.create(item);
        const result1 = await usecase.create(item2);

        expect(result.productUID).toBe(item.productUID);
        expect(result1.productUID).toBe(item2.productUID);
    });

    test("Should not create duplicated item", async () => {
        await usecase.create({
            ...item,
            platformUID: "1",
        });

        await expect(
            usecase.create({
                ...item,
                platformUID: "1",
            }),
        ).rejects.toThrow();
    });

    test("Should update an existing item", async () => {
        await usecase.create(
            makeItem({
                orderUID: "1",
            }),
        );
        await usecase.create(item2);
        const resultItem = await usecase.create(item);

        const newItem: UpdateOrderItemDTO = {
            productUID: "1",
            unitPrice: 100,
            amount: 20,
            orderUID: resultItem.orderUID,
            uid: resultItem.uid,
        };

        const itemUpdated = await usecase.update(newItem);

        expect(itemUpdated.productUID).toBe(newItem.productUID);
    });

    test("Should not update duplicated item", async () => {
        await usecase.create({
            ...item,
            productUID: "1",
            platformUID: "1",
        });

        await expect(
            usecase.create({
                ...item,
                productUID: "1",
                platformUID: "1",
            }),
        ).rejects.toThrow();
    });

    test("Should find an item by id", async () => {
        const resultCreated = await usecase.create(item);

        const result = await usecase.findByUID(resultCreated?.uid);

        expect(result.uid).toBe(resultCreated.uid);
    });

    test("Should find an item by name item", async () => {
        await usecase.create(item);

        const result = await usecase.findByName("Seat");

        expect(result.name).toBe("Seat");
    });

    test("Should return same order existing items", async () => {
        await usecase.create(item2);
        await usecase.create(item);

        await usecase.create(
            makeItem({
                orderUID: "2",
            }),
        );

        const items = await usecase.findItemByOrderUID(item.orderUID);

        expect(items).toHaveLength(2);

        expect(items.every((item) => item.orderUID === item2.orderUID)).toBe(
            true,
        );
    });

    test("Should to delete an item", async () => {
        const seat = await usecase.create(item);
        await usecase.create(item2);

        const fridge = await usecase.create(
            makeItem({
                orderUID: "2",
            }),
        );

        const isDeletedFridge = await usecase.delete(fridge.uid);
        const isDeletedSeat = await usecase.delete(seat.uid);

        expect(isDeletedSeat).toBe(true);
        expect(isDeletedFridge).toBe(true);
    });
});

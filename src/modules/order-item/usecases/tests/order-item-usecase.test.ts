import { CreateOrderItemDTO } from "../../dtos/create-order-item.dto";
import { UpdateOrderItemDTO } from "../../dtos/update-order-item.dto";
import { ItemUsecase } from "../item.usecase";
import { makeItemUsecase } from "./order-item.factory";

const item: CreateOrderItemDTO = {
    orderUID: "1",
    unitPrice: 50,
    productUID: "1",
    amount: 15,
};

const item2: CreateOrderItemDTO = {
    ...item,
    productUID: "2",
};

const makeItem = (data?: Partial<CreateOrderItemDTO>): CreateOrderItemDTO => ({
    productUID: "1",
    orderUID: "1",
    amount: 10,
    unitPrice: 50,
    ...data,
});

describe("ItemUsecase", () => {
    let usecase: ItemUsecase;

    beforeEach(async () => {
        ({ usecase } = await makeItemUsecase());
    });

    test("Should register an item", async () => {
        const result = await usecase.create(item);

        expect(result).toMatchObject({
            productUID: item.productUID,
            orderUID: item.orderUID,
            amount: item.amount,
            unitPrice: item.unitPrice,
        });
        expect(result.uid).toBeDefined();
    });

    test("Should not create duplicated item", async () => {
        await usecase.create(item);

        await expect(usecase.create(item)).rejects.toThrow();
    });

    test("Should update an existing item", async () => {
        await usecase.create(
            makeItem({
                orderUID: "1",
                productUID: "3",
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
        });

        const resultItem = await usecase.create(item2);

        const newItem: UpdateOrderItemDTO = {
            productUID: "1",
            unitPrice: 100,
            amount: 20,
            orderUID: resultItem.orderUID,
            uid: resultItem.uid,
        };

        await expect(usecase.update(newItem)).rejects.toThrow();
    });

    test("Should update item without changing product", async () => {
        const item = await usecase.create({
            orderUID: "1",
            productUID: "1",
            amount: 10,
            unitPrice: 50,
        });

        const updated = await usecase.update({
            uid: item.uid,
            orderUID: item.orderUID,
            productUID: item.productUID,
            amount: 20,
            unitPrice: 100,
        });

        expect(updated.amount).toBe(20);
        expect(updated.unitPrice).toBe(100);
    });

    test("Should find an item by id", async () => {
        const resultCreated = await usecase.create(item);

        const result = await usecase.findByUID(resultCreated?.uid);

        expect(result.uid).toBe(resultCreated.uid);
    });

    test("Should find an item by name productUID and OrderUID", async () => {
        const createdItem = await usecase.create(item);

        const result = await usecase.findByProductAndOrderUID(
            createdItem.productUID,
            createdItem.orderUID,
        );

        expect(result.productUID).toBe(createdItem.productUID);
    });

    test("Should return same order existing items", async () => {
        await usecase.create(item2);
        await usecase.create(item);

        await usecase.create(
            makeItem({
                orderUID: "2",
                productUID: "4",
            }),
        );

        const items = await usecase.findByOrderUID(item.orderUID);

        expect(items).toHaveLength(2);

        expect(items.every((item) => item.orderUID === item2.orderUID)).toBe(
            true,
        );
    });

    test("Should to delete an item", async () => {
        const itemA = await usecase.create(item);
        await usecase.create(item2);

        const itemB = await usecase.create(
            makeItem({
                orderUID: "2",
                productUID: "4",
            }),
        );

        const isDeletedItemA = await usecase.delete(itemB.uid);
        const isDeletedItemB = await usecase.delete(itemA.uid);

        expect(isDeletedItemB).toBe(true);
        expect(isDeletedItemA).toBe(true);
    });
});

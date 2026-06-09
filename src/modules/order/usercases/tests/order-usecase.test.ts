import { CreateOrderDTO } from "../../dtos/create-order.dto";
import { UpdateOrderDTO } from "../../dtos/update-order.dto";
import { InMemoryOrderRepository } from "../../repositories/implementations/in-memory-order.repository";
import { OrderUsecase } from "../order.usecase";

const order: CreateOrderDTO = {
    platformUID: "1",
    description: "Need seats",
};

const order2: CreateOrderDTO = {
    ...order,
    description: "Need Tables",
};

const makeOrder = (data?: Partial<CreateOrderDTO>): CreateOrderDTO => ({
    platformUID: "1",
    description: "Secretary Seat",
    ...data,
});

describe("OrderUsecase", () => {
    let repository: InMemoryOrderRepository;

    let usecase: OrderUsecase;

    beforeEach(() => {
        repository = new InMemoryOrderRepository();

        usecase = new OrderUsecase(repository);
    });

    test("Should register an order", async () => {
        const result = await usecase.create(order);
        const result1 = await usecase.create(order2);

        expect(result.description).toBe(order.description);
        expect(result1.description).toBe(order2.description);
    });

    test("Should not create duplicated order", async () => {
        await usecase.create({
            description: "Need Tables.",
            platformUID: "1",
        });

        await expect(
            usecase.create({
                description: "Need Tables.",
                platformUID: "1",
            }),
        ).rejects.toThrow();
    });
    
    test("Should update an existing order", async () => {
        await usecase.create(
            makeOrder({
                description: "Fridge to the main room.",
            }),
        );
        await usecase.create(order2);
        const resultOrder = await usecase.create(order);

        const newOrder: UpdateOrderDTO = {
            description: "Need Secretary Table",
            uid: resultOrder.uid,
        };

        const orderUpdated = await usecase.update(newOrder);

        expect(orderUpdated.description).toBe(newOrder.description);
    });

    test("Should not update duplicated order", async () => {
        const result = await usecase.create({
            description: "Need Tables.",
            platformUID: "1",
        });

        await usecase.create({
            description: "Need Seats.",
            platformUID: "1",
        });

        await expect(
            usecase.update({
                uid: result.uid,
                description: "Need Seats.",
            }),
        ).rejects.toThrow();
    });

    test("Should find an order by id", async () => {
        const resultCreated = await usecase.create(order);

        const result = await usecase.findByUID(resultCreated.uid);

        expect(result.uid).toBe(resultCreated.uid);
    });

    test("Should find an order by order description", async () => {
        await usecase.create(order);
        await usecase.create(order2);
        await usecase.create(
            makeOrder({
                description: "Seat For New Secretary",
                platformUID: "1",
            }),
        );

        const result = await usecase.findByDescription(
            "Seat For New Secretary",
        );

        expect(result.description).toBe("Seat For New Secretary");
    });


    test("Should return all existing orders", async () => {
        await usecase.create(order2);
        await usecase.create(order);

        await usecase.create(
            makeOrder({
                description: "Fridge to the main room.",
            }),
        );

        const orders = await usecase.find(order.platformUID);

        expect(orders).toHaveLength(5);
    });

    test("Should to delete an order", async () => {
        const seatOrder = await usecase.create(order);
        await usecase.create(order2);

        const fridgeOrder = await usecase.create(
            makeOrder({
                description: "Fridge to the main room.",
            }),
        );

        const isDeletedFridge = await usecase.delete(fridgeOrder.uid);
        const isDeletedSeat = await usecase.delete(seatOrder.uid);

        expect(isDeletedSeat).toBe(true);
        expect(isDeletedFridge).toBe(true);
    });
});

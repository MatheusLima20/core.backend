import { CreateOrderDTO } from "../../dtos/create-order.dto";
import { UpdateOrderDTO } from "../../dtos/update-order.dto";
import { InMemoryOrderRepository } from "../../repositories/implementations/in-memory-order.repository";
import { OrderUseCase } from "../order.usecase";

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

    let useCase: OrderUseCase;

    beforeEach(() => {
        repository = new InMemoryOrderRepository();

        useCase = new OrderUseCase(repository);
    });

    test("Should register an order", async () => {
        const result = await useCase.create(order);
        const result1 = await useCase.create(order2);

        expect(result.description).toBe(order.description);
        expect(result1.description).toBe(order2.description);
    });

    test("Should find an order by id", async () => {
        const resultCreated = await useCase.create(order);

        const result = await useCase.findByUID(resultCreated?.uid);

        expect(result.uid).toBe(resultCreated.uid);
    });

    test("Should find an order by order description", async () => {
        await useCase.create(order);
        await useCase.create(order2);
        await useCase.create(
            makeOrder({
                description: "Seat For New Secretary",
                platformUID: "1",
            }),
        );

        const result = await useCase.findByDescription(
            "Seat For New Secretary",
        );

        expect(result.description).toBe("Seat For New Secretary");
    });

    test("Should update an existing order", async () => {
        await useCase.create(
            makeOrder({
                description: "Fridge to the main room.",
            }),
        );
        await useCase.create(order2);
        const resultOrder = await useCase.create(order);

        const newOrder: UpdateOrderDTO = {
            description: "Need Secretary Table",
            uid: resultOrder.uid,
        };

        const orderUpdated = await useCase.update(newOrder);

        expect(orderUpdated.description).toBe(newOrder.description);
    });

    test("Should return all existing orders", async () => {
        await useCase.create(order2);
        await useCase.create(order);

        await useCase.create(
            makeOrder({
                description: "Fridge to the main room.",
            }),
        );

        const orders = await useCase.find(order.platformUID);

        expect(orders).toHaveLength(5);
    });

    test("Should to delete an order", async () => {
        const seatOrder = await useCase.create(order);
        await useCase.create(order2);

        const fridgeOrder = await useCase.create(
            makeOrder({
                description: "Fridge to the main room.",
            }),
        );

        const isDeletedFridge = await useCase.delete(fridgeOrder.uid);
        const isDeletedSeat = await useCase.delete(seatOrder.uid);

        expect(isDeletedSeat).toBe(true);
        expect(isDeletedFridge).toBe(true);
    });
});

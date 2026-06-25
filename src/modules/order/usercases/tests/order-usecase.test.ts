import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateOrderDTO } from "../../dtos/create-order.dto";
import { UpdateOrderDTO } from "../../dtos/update-order.dto";
import { OrderAlreadyExistsError } from "../../errors/order-already-exists.error";
import { OrderNotFoundError } from "../../errors/order-not-found.error";
import { scenario } from "../core/test-factory";
import { expectCreateOrderFailure, setupOrder, setupOrders } from "../helpers/order.helper";
import { OrderUsecase } from "../order.usecase";

describe("OrderUsecase", () => {
    const dataOrder1: CreateOrderDTO = {
        description: "Need Seats",
    };

    const dataOrder2: CreateOrderDTO = {
        ...dataOrder1,
        description: "Need Tables",
    };

    let usecaseUser1!: OrderUsecase;
    let usecaseUser2!: OrderUsecase;

    let user1: AuthUser;
    let user2: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should register an order", async () => {
        const [orderA, orderB] = await Promise.all([
            setupOrder(usecaseUser1, dataOrder1),
            setupOrder(usecaseUser2, dataOrder2),
        ]);

        expect(orderA).toMatchObject({
            description: dataOrder1.description,
            platformUID: user1.platformUID,
            createdBy: user1.uid,
            uid: expect.any(String),
        });

        expect(orderB).toMatchObject({
            description: dataOrder2.description,
            platformUID: user2.platformUID,
            createdBy: user2.uid,
            uid: expect.any(String),
        });
    });

    test("Should allow same order description in different platforms", async () => {
        await setupOrder(usecaseUser1, dataOrder1);
        await setupOrder(usecaseUser2, dataOrder1);
    });

    test("Should not create duplicated order", async () => {
        await setupOrder(usecaseUser1, dataOrder1);

        await expectCreateOrderFailure(usecaseUser1, dataOrder1, OrderAlreadyExistsError);
    });

    test("Should update an order", async () => {
        const [orderCreated] = await setupOrders(usecaseUser1, dataOrder1, dataOrder2);

        const updated: UpdateOrderDTO = {
            uid: orderCreated.uid,
            description: "Need Updated Tables",
        };

        const orderUpdated = expectSuccess(await usecaseUser1.update(updated));

        expect(orderUpdated).toMatchObject({
            uid: orderCreated.uid,
            description: updated.description,
            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(orderUpdated.uid));

        expect(found).toMatchObject({
            uid: orderUpdated.uid,
            description: updated.description,
            updatedBy: user1.uid,
        });
    });

    test("Should not update duplicated order", async () => {
        const [orderA] = await setupOrders(usecaseUser1, dataOrder1, dataOrder2);

        expectFailure(
            await usecaseUser1.update({
                uid: orderA.uid,
                description: dataOrder2.description,
            }),
            OrderAlreadyExistsError
        );
    });

    test("Should find order by uid", async () => {
        const [created] = await setupOrders(usecaseUser1, dataOrder1);

        const found = expectSuccess(await usecaseUser1.findByUID(created.uid));

        expect(found).toMatchObject({
            uid: created.uid,
            description: created.description,
        });
    });

    test("Should throw when order not found", async () => {
        expectFailure(await usecaseUser1.findByUID("invalid-id"), OrderNotFoundError);
    });

    test("Should return all orders of platform", async () => {
        await setupOrders(usecaseUser2, dataOrder1, dataOrder2);

        const orders = expectSuccess(await usecaseUser2.find());

        expect(orders).toHaveLength(2);

        expect(orders.every((o) => o.platformUID === user2.platformUID)).toBe(true);
    });

    test("Should return empty list when no orders exist", async () => {
        const orders = expectSuccess(await usecaseUser2.find());

        expect(orders).toEqual([]);
    });

    test("Should delete order", async () => {
        const [created] = await setupOrders(usecaseUser1, dataOrder1);

        const before = expectSuccess(await usecaseUser1.find());

        expectSuccess(await usecaseUser1.delete(created.uid));

        const after = expectSuccess(await usecaseUser1.find());

        expect(after.length).toBe(before.length - 1);

        expectFailure(await usecaseUser1.findByUID(created.uid), OrderNotFoundError);
    });
});

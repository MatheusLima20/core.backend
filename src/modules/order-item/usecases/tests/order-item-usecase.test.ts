import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateOrderItemDTO } from "../../dtos/create-order-item.dto";
import { UpdateOrderItemDTO } from "../../dtos/update-order-item.dto";
import { OrderItemAlreadyExistsError } from "../../errors/order-item-already-exists.error";
import { OrderItemNotFoundError } from "../../errors/order-item-not-found.error";
import { scenario } from "../core/test-factory";
import {
    expectCreateOrderItemFailure,
    setupOrderItem,
    setupOrderItems,
} from "../helpers/order-item.helper";
import { OrderItemUsecase } from "../order-item.usecase";

describe("OrderItemUsecase", () => {
    const dataOrderItem1: CreateOrderItemDTO = {
        orderUID: "1",
        productUID: "1",
        amount: 10,
        unitPrice: 50,
    };

    const dataOrderItem2: CreateOrderItemDTO = {
        ...dataOrderItem1,
        productUID: "2",
    };

    let usecaseUser1!: OrderItemUsecase;
    let usecaseUser2!: OrderItemUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should register order items for different users", async () => {
        const [itemA, itemB] = await Promise.all([
            setupOrderItem(usecaseUser1, dataOrderItem1),
            setupOrderItem(usecaseUser2, dataOrderItem2),
        ]);

        expect(itemA).toMatchObject({
            orderUID: dataOrderItem1.orderUID,
            productUID: dataOrderItem1.productUID,
            amount: dataOrderItem1.amount,
            unitPrice: dataOrderItem1.unitPrice,
            createdBy: user1.uid,
        });

        expect(itemB).toMatchObject({
            orderUID: dataOrderItem2.orderUID,
            productUID: dataOrderItem2.productUID,
            amount: dataOrderItem2.amount,
            unitPrice: dataOrderItem2.unitPrice,
            createdBy: user2.uid,
        });
    });

    test("Should allow same product in different users platform", async () => {
        await setupOrderItems(usecaseUser1, dataOrderItem1);
        await setupOrderItems(usecaseUser2, dataOrderItem1);
    });

    test("Should not create duplicated item in same user", async () => {
        await setupOrderItems(usecaseUser1, dataOrderItem1);

        await expectCreateOrderItemFailure(
            usecaseUser1,
            dataOrderItem1,
            OrderItemAlreadyExistsError
        );
    });

    test("Should update order item", async () => {
        const [createdA] = await setupOrderItems(usecaseUser1, dataOrderItem1, dataOrderItem2);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: createdA.uid,
                orderUID: createdA.orderUID,
                productUID: createdA.productUID,
                amount: 20,
                unitPrice: 100,
            })
        );

        expect(updated.amount).toBe(20);
        expect(updated.unitPrice).toBe(100);
        expect(updated.updatedBy).toBe(user1.uid);
    });

    test("Should not update duplicated item", async () => {
        const [itemA] = await setupOrderItems(usecaseUser1, dataOrderItem1, dataOrderItem2);

        const invalidUpdate: UpdateOrderItemDTO = {
            uid: itemA.uid,
            orderUID: itemA.orderUID,
            productUID: dataOrderItem2.productUID,
            amount: 20,
            unitPrice: 100,
        };

        expectFailure(await usecaseUser1.update(invalidUpdate), OrderItemAlreadyExistsError);
    });

    test("Should update item keeping same product", async () => {
        const item = await setupOrderItem(usecaseUser2, dataOrderItem1);

        const updated = expectSuccess(
            await usecaseUser2.update({
                uid: item.uid,
                orderUID: item.orderUID,
                productUID: item.productUID,
                amount: 99,
                unitPrice: 200,
            })
        );

        expect(updated.amount).toBe(99);
        expect(updated.updatedBy).toBe(user2.uid);
    });

    test("Should find item by UID", async () => {
        const created = await setupOrderItem(usecaseUser1, dataOrderItem1);

        const found = expectSuccess(await usecaseUser1.findByUID(created.uid));

        expect(found.uid).toBe(created.uid);
    });

    test("Should throw when item does not exist", async () => {
        expectFailure(await usecaseUser1.findByUID("999"), OrderItemNotFoundError);
    });

    test("Should find items by orderUID", async () => {
        await setupOrderItems(usecaseUser1, dataOrderItem1, dataOrderItem2);

        const items = expectSuccess(await usecaseUser1.findByOrderUID(dataOrderItem1.orderUID));

        expect(items).toHaveLength(2);
        expect(items.every((item) => item.orderUID === dataOrderItem1.orderUID)).toBe(true);
    });

    test("Should delete order items", async () => {
        const [itemA, itemB] = await setupOrderItems(usecaseUser1, dataOrderItem1, dataOrderItem2);

        expectSuccess(await usecaseUser1.delete(itemA.uid));
        expectSuccess(await usecaseUser1.delete(itemB.uid));

        expectFailure(await usecaseUser1.findByUID(itemA.uid), OrderItemNotFoundError);
    });
});

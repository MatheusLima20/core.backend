import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { InMemoryFeedRepository } from "../../repositories/implementations/in-memory-feed.repository";
import { FeedUsecase } from "../feed.usecase";
import { makeFeed } from "./factories/feed.factory";

describe("FeedUsecase - create", () => {
    let usecase!: FeedUsecase;

    let user!: AuthUser;

    beforeEach(() => {
        user = {
            uid: "user-1",
            platformUID: "platform-1",
        } as AuthUser;

        usecase = new FeedUsecase({ user }, new InMemoryFeedRepository());
    });

    test("Should register feed", async () => {
        const feed = makeFeed();

        const created = expectSuccess(await usecase.create(feed));

        expect(created).toMatchObject({
            name: feed.name,
            description: feed.description,

            uid: expect.any(String),

            platformUID: user.platformUID,

            createdBy: user.uid,

            createdAt: expect.any(Date),
        });
    });

    test("Should register feed with its items", async () => {
        const feed = makeFeed({
            items: [
                {
                    inventoryItemUID: "inventory-item-1",
                    inclusionPercentage: 60,
                },
                {
                    inventoryItemUID: "inventory-item-2",
                    inclusionPercentage: 30,
                },
                {
                    inventoryItemUID: "inventory-item-3",
                    inclusionPercentage: 10,
                },
            ],
        });

        const created = expectSuccess(await usecase.create(feed));

        const found = expectSuccess(await usecase.findByUID(created.uid));

        expect(found).toMatchObject({
            uid: created.uid,

            name: feed.name,

            description: feed.description,

            items: [
                {
                    inventoryItemUID: "inventory-item-1",
                    inclusionPercentage: 60,
                },
                {
                    inventoryItemUID: "inventory-item-2",
                    inclusionPercentage: 30,
                },
                {
                    inventoryItemUID: "inventory-item-3",
                    inclusionPercentage: 10,
                },
            ],
        });
    });

    test("Should register feed without description", async () => {
        const created = expectSuccess(
            await usecase.create(
                makeFeed({
                    description: undefined,
                })
            )
        );

        expect(created.description).toBeUndefined();
    });

    test("Should register feed without items", async () => {
        const created = expectSuccess(
            await usecase.create(
                makeFeed({
                    items: [],
                })
            )
        );

        const found = expectSuccess(await usecase.findByUID(created.uid));

        expect(found?.items).toEqual([]);
    });

    test("Should allow feeds with the same name", async () => {
        const feed = makeFeed();

        const first = expectSuccess(await usecase.create(feed));

        const second = expectSuccess(await usecase.create(feed));

        expect(first.uid).not.toBe(second.uid);
    });
});

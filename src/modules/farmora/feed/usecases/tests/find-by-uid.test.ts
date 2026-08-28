import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { FeedUsecase } from "../feed.usecase";
import { makeFeed } from "./factories/feed.factory";
import { setupFeed } from "./setup/feed.setup";
import { scenario } from "./setup/test-builder";

describe("FeedUsecase - findByUID", () => {
    let usecaseUser1!: FeedUsecase;
    let usecaseUser2!: FeedUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    beforeEach(async () => {
        ({
            feedUsecases: [usecaseUser1, usecaseUser2],
            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find a feed by uid", async () => {
        const feed = await setupFeed(usecaseUser1, makeFeed());

        const found = expectSuccess(await usecaseUser1.findByUID(feed.uid));

        expect(found).toMatchObject({
            uid: feed.uid,

            name: feed.name,

            description: feed.description,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            items: [],

            createdAt: expect.any(Date),

            updatedAt: expect.any(Date),
        });
    });

    test("Should find a feed with its items", async () => {
        const feed = await setupFeed(
            usecaseUser1,
            makeFeed({
                items: [
                    {
                        inventoryItemUID: "inventory-item-1",
                        inclusionPercentage: 60,
                    },
                    {
                        inventoryItemUID: "inventory-item-2",
                        inclusionPercentage: 40,
                    },
                ],
            })
        );

        const found = expectSuccess(await usecaseUser1.findByUID(feed.uid));

        expect(found?.items).toEqual([
            {
                uid: expect.any(String),
                inventoryItemUID: "inventory-item-1",
                inclusionPercentage: 60,
            },
            {
                uid: expect.any(String),
                inventoryItemUID: "inventory-item-2",
                inclusionPercentage: 40,
            },
        ]);
    });

    test("Should return null when uid does not exist", async () => {
        const found = expectSuccess(await usecaseUser1.findByUID("invalid-feed"));

        expect(found).toBe(null);
    });

    test("Should not find a feed from another platform", async () => {
        const feed = await setupFeed(usecaseUser1, makeFeed());

        const found = expectSuccess(await usecaseUser2.findByUID(feed.uid));

        expect(found).toBe(null);
    });

    test("Should return all persisted feed data", async () => {
        const feed = await setupFeed(
            usecaseUser1,
            makeFeed({
                items: [
                    {
                        inventoryItemUID: "inventory-item-1",
                        inclusionPercentage: 70,
                    },
                    {
                        inventoryItemUID: "inventory-item-2",
                        inclusionPercentage: 30,
                    },
                ],
            })
        );

        const found = expectSuccess(await usecaseUser1.findByUID(feed.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: feed.uid,

                name: feed.name,

                description: feed.description,

                platformUID: user1.platformUID,

                createdBy: user1.uid,

                updatedBy: undefined,

                createdAt: expect.any(Date),

                updatedAt: expect.any(Date),

                items: [
                    {
                        uid: expect.any(String),
                        inventoryItemUID: "inventory-item-1",
                        inclusionPercentage: 70,
                    },
                    {
                        uid: expect.any(String),
                        inventoryItemUID: "inventory-item-2",
                        inclusionPercentage: 30,
                    },
                ],
            })
        );

        expect(found?.createdBy).not.toBe(user2.uid);
    });

    test("Should not return deleted feed", async () => {
        const feed = await setupFeed(usecaseUser1, makeFeed());

        await usecaseUser1.delete(feed.uid);

        const found = expectSuccess(await usecaseUser1.findByUID(feed.uid));

        expect(found).toBe(null);
    });
});

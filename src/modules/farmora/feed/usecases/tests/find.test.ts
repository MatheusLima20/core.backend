import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { FeedUsecase } from "../feed.usecase";
import { makeFeed } from "./factories/feed.factory";
import { setupFeed, setupFeeds } from "./setup/feed.setup";
import { scenario } from "./setup/test-builder";

describe("FeedUsecase - find", () => {
    let usecaseUser1!: FeedUsecase;
    let usecaseUser2!: FeedUsecase;

    let user1!: AuthUser;

    beforeEach(async () => {
        const testScenario = await scenario().loadUsers(["1", "2"]);

        await testScenario.loadInventoryItems();

        ({
            feedUsecases: [usecaseUser1, usecaseUser2],
            users: [user1],
        } = testScenario.createUsecases().build());
    });

    test("Should find all platform feeds", async () => {
        await setupFeeds(
            usecaseUser1,
            makeFeed({
                name: "Posture Feed",
            }),
            makeFeed({
                name: "Growth Feed",
            })
        );

        const feeds = expectSuccess(await usecaseUser1.find());

        expect(feeds.data.every((feed) => feed.platformUID === user1.platformUID)).toBe(true);
        expect(feeds.total).toBe(2);
        expect(feeds.data).toHaveLength(2);
    });

    test("Should return empty list when platform has no feeds", async () => {
        const feeds = expectSuccess(await usecaseUser2.find());

        expect(feeds.total).toBe(0);
        expect(feeds.data).toEqual([]);
    });

    test("Should filter feeds by name", async () => {
        await setupFeeds(
            usecaseUser1,
            makeFeed({
                name: "Posture Feed",
            }),
            makeFeed({
                name: "Growth Feed",
            })
        );

        const feeds = expectSuccess(
            await usecaseUser1.find({
                name: "Posture Feed",
            })
        );

        expect(feeds.total).toBe(1);
        expect(feeds.data).toHaveLength(1);
        expect(feeds.data[0].name).toBe("Posture Feed");
    });

    test("Should return feeds with their items", async () => {
        const feed = await setupFeed(
            usecaseUser1,
            makeFeed({
                name: "Posture Feed",
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

        const feeds = expectSuccess(await usecaseUser1.find());

        expect(feeds.total).toBe(1);
        expect(feeds.data).toHaveLength(1);

        expect(feeds.data[0].uid).toBe(feed.uid);

        expect(feeds.data[0].items).toHaveLength(2);

        expect(feeds.data[0].items).toEqual([
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

    test("Should order feeds by name descending", async () => {
        const corn = await setupFeed(
            usecaseUser1,
            makeFeed({
                name: "Corn Feed",
            })
        );

        const soybean = await setupFeed(
            usecaseUser1,
            makeFeed({
                name: "Soybean Feed",
            })
        );

        const feeds = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "desc",
            })
        );

        expect(feeds.data.map((feed) => feed.uid)).toEqual([soybean.uid, corn.uid]);
    });

    test("Should return first page", async () => {
        const [feedA, feedB] = await setupFeeds(
            usecaseUser1,
            makeFeed({
                name: "Feed A",
            }),
            makeFeed({
                name: "Feed B",
            }),
            makeFeed({
                name: "Feed C",
            })
        );

        const feeds = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(feeds.total).toBe(3);
        expect(feeds.totalPages).toBe(2);
        expect(feeds.page).toBe(1);
        expect(feeds.limit).toBe(2);

        expect(feeds.data).toHaveLength(2);
        expect(feeds.data.map((feed) => feed.uid)).toEqual([feedA.uid, feedB.uid]);
    });

    test("Should filter, order and paginate feeds", async () => {
        const feedB = await setupFeed(
            usecaseUser1,
            makeFeed({
                name: "Corn Feed",
            })
        );

        const feedA = await setupFeed(
            usecaseUser1,
            makeFeed({
                name: "Soybean Feed",
            })
        );

        await setupFeed(
            usecaseUser1,
            makeFeed({
                name: "A Wheat Feed",
            })
        );

        const feeds = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "desc",
                page: 1,
                limit: 2,
            })
        );

        expect(feeds.total).toBe(3);
        expect(feeds.totalPages).toBe(2);
        expect(feeds.page).toBe(1);
        expect(feeds.limit).toBe(2);

        expect(feeds.data).toHaveLength(2);

        expect(feeds.data.map((feed) => feed.uid)).toEqual([feedA.uid, feedB.uid]);
    });
});

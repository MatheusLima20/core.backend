import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { FeedNotFoundError } from "../../errors/feed-not-found.error";
import { FeedUsecase } from "../feed.usecase";
import { makeFeed } from "./factories/feed.factory";
import { setupFeed, setupFeeds } from "./setup/feed.setup";
import { scenario } from "./setup/test-builder";

describe("FeedUsecase - delete", () => {
    let usecase!: FeedUsecase;

    beforeEach(async () => {
        const testScenario = await scenario().loadUsers(["1"]);

        await testScenario.loadInventoryItems();

        ({
            feedUsecases: [usecase],
        } = testScenario.createUsecases().build());
    });

    test("Should delete a feed", async () => {
        const feed = await setupFeed(
            usecase,
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

        const before = expectSuccess(await usecase.find());

        expectSuccess(await usecase.delete(feed.uid));

        const after = expectSuccess(await usecase.find());

        expect(before.total).toBe(1);
        expect(before.data).toHaveLength(1);

        expect(after.total).toBe(0);
        expect(after.data).toHaveLength(0);

        const found = expectSuccess(await usecase.findByUID(feed.uid));

        expect(found).toBe(null);
    });

    test("Should delete feed and its items", async () => {
        const feed = await setupFeed(
            usecase,
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

        expectSuccess(await usecase.delete(feed.uid));

        const found = expectSuccess(await usecase.findByUID(feed.uid));

        expect(found).toBe(null);
    });

    test("Should not delete an inexistent feed", async () => {
        expectFailure(await usecase.delete("invalid-feed"), FeedNotFoundError);
    });

    test("Should delete only selected feed", async () => {
        const [feedA, feedB] = await setupFeeds(
            usecase,
            makeFeed({
                name: "Posture Feed",
            }),
            makeFeed({
                name: "Growth Feed",
            })
        );

        expectSuccess(await usecase.delete(feedA.uid));

        const deleted = expectSuccess(await usecase.findByUID(feedA.uid));

        expect(deleted).toBe(null);

        const remaining = expectSuccess(await usecase.findByUID(feedB.uid));

        expect(remaining?.uid).toBe(feedB.uid);
    });

    test("Should delete one feed keeping remaining feeds", async () => {
        const [feedA, feedB, feedC] = await setupFeeds(
            usecase,
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

        expectSuccess(await usecase.delete(feedB.uid));

        const feeds = expectSuccess(await usecase.find());

        expect(feeds.total).toBe(2);
        expect(feeds.data).toHaveLength(2);

        expect(feeds.data.map((feed) => feed.uid)).toEqual(
            expect.arrayContaining([feedA.uid, feedC.uid])
        );

        const deleted = expectSuccess(await usecase.findByUID(feedB.uid));

        expect(deleted).toBe(null);
    });
});

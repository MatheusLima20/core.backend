import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { UpdateFeedDTO } from "../../dtos/update-feed.dto";
import { FeedNotFoundError } from "../../errors/feed-not-found.error";
import { FeedUsecase } from "../feed.usecase";
import { makeFeed } from "./factories/feed.factory";
import { setupFeed } from "./setup/feed.setup";
import { scenario } from "./setup/test-builder";

describe("FeedUsecase - update", () => {
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

    test("Should update a feed", async () => {
        const feed = await setupFeed(
            usecaseUser1,
            makeFeed({
                name: "Original Feed",
                description: "Original description",
            })
        );

        const data: UpdateFeedDTO = {
            uid: feed.uid,
            name: "Updated Feed",
            description: "Updated description",
        };

        const updated = expectSuccess(await usecaseUser1.update(data));

        expect(updated).toMatchObject({
            uid: feed.uid,

            name: data.name,

            description: data.description,

            platformUID: user1.platformUID,

            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(feed.uid));

        expect(found).toMatchObject(updated);

        expect(found?.updatedBy).not.toBe(user2.uid);
    });

    test("Should update only name", async () => {
        const feed = await setupFeed(
            usecaseUser1,
            makeFeed({
                name: "Original Feed",
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: feed.uid,
                name: "New Name",
            })
        );

        expect(updated.name).toBe("New Name");
    });

    test("Should update only description", async () => {
        const feed = await setupFeed(
            usecaseUser1,
            makeFeed({
                description: "Old description",
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: feed.uid,
                description: "New description",
            })
        );

        expect(updated.description).toBe("New description");
    });

    test("Should remove description", async () => {
        const feed = await setupFeed(
            usecaseUser1,
            makeFeed({
                description: "Old description",
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: feed.uid,
                description: undefined,
            })
        );

        expect(updated.description).toBeUndefined();
    });

    test("Should update feed items", async () => {
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

        const existing = expectSuccess(await usecaseUser1.findByUID(feed.uid));

        const existingItemUID = existing!.items[0].uid;

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: feed.uid,
                items: [
                    {
                        uid: existingItemUID,
                        inventoryItemUID: "inventory-item-1",
                        inclusionPercentage: 70,
                    },
                    {
                        inventoryItemUID: "inventory-item-3",
                        inclusionPercentage: 30,
                    },
                ],
            })
        );

        expect(updated.items).toHaveLength(2);

        expect(updated.items).toEqual([
            {
                uid: existingItemUID,
                inventoryItemUID: "inventory-item-1",
                inclusionPercentage: 70,
            },
            {
                uid: expect.any(String),
                inventoryItemUID: "inventory-item-3",
                inclusionPercentage: 30,
            },
        ]);
    });

    test("Should preserve feed uid when updating", async () => {
        const feed = await setupFeed(usecaseUser1, makeFeed());

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: feed.uid,
                name: "Updated Feed",
            })
        );

        expect(updated.uid).toBe(feed.uid);
    });

    test("Should preserve existing feed item uid when updating its data", async () => {
        const feed = await setupFeed(
            usecaseUser1,
            makeFeed({
                items: [
                    {
                        inventoryItemUID: "inventory-item-1",
                        inclusionPercentage: 60,
                    },
                ],
            })
        );

        const before = expectSuccess(await usecaseUser1.findByUID(feed.uid));

        const itemUID = before!.items[0].uid;

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: feed.uid,
                items: [
                    {
                        uid: itemUID,
                        inventoryItemUID: "inventory-item-1",
                        inclusionPercentage: 70,
                    },
                ],
            })
        );

        expect(updated.items[0].uid).toBe(itemUID);
        expect(updated.items[0].inclusionPercentage).toBe(70);
    });

    test("Should not update an inexistent feed", async () => {
        expectFailure(
            await usecaseUser1.update({
                uid: "invalid-feed",
                name: "Updated Feed",
            }),
            FeedNotFoundError
        );
    });

    test("Should not update feed from another platform", async () => {
        const feed = await setupFeed(usecaseUser1, makeFeed());

        expectFailure(
            await usecaseUser2.update({
                uid: feed.uid,
                name: "Updated Feed",
            }),
            FeedNotFoundError
        );
    });
});

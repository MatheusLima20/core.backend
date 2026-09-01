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
        const testScenario = await scenario().loadUsers(["1", "2"]);

        await testScenario.loadInventoryItems();

        ({
            feedUsecases: [usecaseUser1, usecaseUser2],
            users: [user1, user2],
        } = testScenario.createUsecases().build());
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
                description: "",
            })
        );

        expect(updated.description).toBe("");
    });

    test("Should update an existing feed item and add a new feed item", async () => {
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

        const before = expectSuccess(await usecaseUser1.findByUID(feed.uid));

        const existingItemUID = before!.items[0].uid;
        const existingSecondItemUID = before!.items[1].uid;

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: feed.uid,
                items: [
                    {
                        uid: existingItemUID,
                        inventoryItemUID: "inventory-item-1",
                        inclusionPercentage: 30,
                    },
                    {
                        inventoryItemUID: "inventory-item-3",
                        inclusionPercentage: 30,
                    },
                ],
            })
        );

        /*
         * O segundo item existente permanece no Feed.
         *
         * Composição final:
         * 30 + 40 + 30 = 100
         */
        expect(updated.items).toHaveLength(3);

        expect(updated.items).toEqual([
            {
                uid: existingItemUID,
                inventoryItemUID: "inventory-item-1",
                inclusionPercentage: 30,
            },
            {
                uid: existingSecondItemUID,
                inventoryItemUID: "inventory-item-2",
                inclusionPercentage: 40,
            },
            {
                uid: expect.any(String),
                inventoryItemUID: "inventory-item-3",
                inclusionPercentage: 30,
            },
        ]);
    });

    test("Should preserve feed items that were not sent", async () => {
        const feed = await setupFeed(
            usecaseUser1,
            makeFeed({
                items: [
                    {
                        inventoryItemUID: "inventory-item-1",
                        inclusionPercentage: 50,
                    },
                    {
                        inventoryItemUID: "inventory-item-2",
                        inclusionPercentage: 30,
                    },
                    {
                        inventoryItemUID: "inventory-item-3",
                        inclusionPercentage: 20,
                    },
                ],
            })
        );

        const before = expectSuccess(await usecaseUser1.findByUID(feed.uid));

        const firstItem = before!.items[0];
        const secondItem = before!.items[1];
        const thirdItem = before!.items[2];

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: feed.uid,
                items: [
                    {
                        uid: firstItem.uid,
                        inventoryItemUID: firstItem.inventoryItemUID,
                        inclusionPercentage: 50,
                    },
                ],
            })
        );

        /*
         * Somente o primeiro item foi enviado.
         *
         * Os itens 2 e 3 não foram enviados e devem permanecer.
         *
         * Composição final:
         * 50 + 30 + 20 = 100
         */
        expect(updated.items).toHaveLength(3);

        expect(updated.items).toEqual([
            {
                uid: firstItem.uid,
                inventoryItemUID: firstItem.inventoryItemUID,
                inclusionPercentage: 50,
            },
            {
                uid: secondItem.uid,
                inventoryItemUID: secondItem.inventoryItemUID,
                inclusionPercentage: secondItem.inclusionPercentage,
            },
            {
                uid: thirdItem.uid,
                inventoryItemUID: thirdItem.inventoryItemUID,
                inclusionPercentage: thirdItem.inclusionPercentage,
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
                    {
                        inventoryItemUID: "inventory-item-2",
                        inclusionPercentage: 40,
                    },
                ],
            })
        );

        const before = expectSuccess(await usecaseUser1.findByUID(feed.uid));

        const item = before!.items[0];
        const secondItem = before!.items[1];

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: feed.uid,
                items: [
                    {
                        uid: item.uid,
                        inventoryItemUID: item.inventoryItemUID,
                        inclusionPercentage: 70,
                    },
                    {
                        uid: secondItem.uid,
                        inventoryItemUID: secondItem.inventoryItemUID,
                        inclusionPercentage: 30,
                    },
                ],
            })
        );

        /*
         * O UID do item existente deve ser preservado.
         *
         * Composição final:
         * 70 + 30 = 100
         */
        expect(updated.items).toHaveLength(2);

        expect(updated.items).toEqual([
            {
                uid: item.uid,
                inventoryItemUID: item.inventoryItemUID,
                inclusionPercentage: 70,
            },
            {
                uid: secondItem.uid,
                inventoryItemUID: secondItem.inventoryItemUID,
                inclusionPercentage: 30,
            },
        ]);
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

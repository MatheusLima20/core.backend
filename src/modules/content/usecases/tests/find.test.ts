import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { ContentUsecase } from "../content.usecase";
import { dataContent1, dataContent2 } from "./factories/content-data.factory";
import { setupContent, setupContents } from "./setup/setup-content";
import { scenario } from "./setup/test-builder";

describe("ContentUsecase - find", () => {
    let usecaseUser1!: ContentUsecase;
    let usecaseUser2!: ContentUsecase;

    let user1!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            users: [user1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find all platform contents", async () => {
        await setupContents(usecaseUser1, dataContent1, dataContent2);

        const contents = expectSuccess(await usecaseUser1.find());

        expect(contents.data.every((content) => content.platformUID === user1.platformUID)).toBe(
            true
        );
    });

    test("Should return empty list when platform has no contents", async () => {
        const contents = expectSuccess(await usecaseUser2.find());

        expect(contents.data).toEqual([]);
    });

    test("Should filter contents by name", async () => {
        await setupContents(usecaseUser1, dataContent1, dataContent2);

        const contents = expectSuccess(
            await usecaseUser1.find({
                name: dataContent1.name,
            })
        );

        expect(contents.data).toHaveLength(1);
        expect(contents.data[0].name).toBe(dataContent1.name);
    });

    test("Should filter contents by type", async () => {
        await setupContents(
            usecaseUser1,
            {
                ...dataContent1,
                type: dataContent1.type,
            },
            {
                ...dataContent2,
                type: dataContent2.type,
            }
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                type: dataContent1.type,
            })
        );

        expect(contents.data).toHaveLength(2);
        expect(contents.data[0].type).toBe(dataContent1.type);
    });

    test("Should filter contents by mime type", async () => {
        await setupContents(
            usecaseUser1,
            {
                ...dataContent1,
                mimeType: "image/jpeg",
            },
            {
                ...dataContent2,
                mimeType: "application/pdf",
            }
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                mimeType: "image/jpeg",
            })
        );

        expect(contents.data).toHaveLength(1);
        expect(contents.data[0].mimeType).toBe("image/jpeg");
    });

    test("Should search contents by name and type", async () => {
        await setupContents(usecaseUser1, dataContent1, dataContent2);

        const contents = expectSuccess(
            await usecaseUser1.find({
                name: dataContent1.name,
                type: dataContent1.type,
            })
        );

        expect(contents.data).toHaveLength(1);

        expect(contents.data[0]).toMatchObject({
            name: dataContent1.name,
            type: dataContent1.type,
        });
    });

    test("Should return empty when filters match nothing", async () => {
        await setupContent(usecaseUser1, dataContent1);

        const contents = expectSuccess(
            await usecaseUser1.find({
                name: "Invalid Content",
            })
        );

        expect(contents.data).toEqual([]);
    });

    test("Should order contents by name ascending", async () => {
        const contentB = await setupContent(usecaseUser1, {
            ...dataContent1,
            name: "Banana",
        });

        const contentA = await setupContent(usecaseUser1, {
            ...dataContent2,
            name: "Apple",
        });

        const contents = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "asc",
            })
        );

        expect(contents.data.map((content) => content.uid)).toEqual([contentA.uid, contentB.uid]);
    });

    test("Should order contents by name descending", async () => {
        const contentB = await setupContent(usecaseUser1, {
            ...dataContent1,
            name: "Banana",
        });

        const contentA = await setupContent(usecaseUser1, {
            ...dataContent2,
            name: "Apple",
        });

        const contents = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "desc",
            })
        );

        expect(contents.data.map((content) => content.uid)).toEqual([contentB.uid, contentA.uid]);
    });

    test("Should return first page", async () => {
        const [contentA, contentB] = await setupContents(
            usecaseUser1,
            dataContent1,
            dataContent2,
            {
                ...dataContent1,
                name: "Content 3",
            },
            {
                ...dataContent1,
                name: "Content 4",
            }
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(contents.data).toHaveLength(2);

        expect(contents.data.map((content) => content.uid)).toEqual([contentA.uid, contentB.uid]);
    });

    test("Should return second page", async () => {
        const [, , contentC, contentD] = await setupContents(
            usecaseUser1,
            dataContent1,
            dataContent2,
            {
                ...dataContent1,
                name: "Content 3",
            },
            {
                ...dataContent1,
                name: "Content 4",
            }
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                page: 2,
                limit: 2,
            })
        );

        expect(contents.data.map((content) => content.uid)).toEqual([contentC.uid, contentD.uid]);
    });

    test("Should return remaining contents on last page", async () => {
        const [, , , , contentE] = await setupContents(
            usecaseUser1,
            dataContent1,
            dataContent2,
            {
                ...dataContent1,
                name: "Content 3",
            },
            {
                ...dataContent1,
                name: "Content 4",
            },
            {
                ...dataContent1,
                name: "Content 5",
            }
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                page: 3,
                limit: 2,
            })
        );

        expect(contents.data.map((content) => content.uid)).toEqual([contentE.uid]);
    });

    test("Should return empty list when page does not exist", async () => {
        await setupContents(usecaseUser1, dataContent1, dataContent2);

        const contents = expectSuccess(
            await usecaseUser1.find({
                page: 10,
                limit: 10,
            })
        );

        expect(contents.data).toEqual([]);
    });

    test("Should filter and order contents", async () => {
        const contentB = await setupContent(usecaseUser1, {
            ...dataContent1,
            name: "Banana",
            type: dataContent1.type,
        });

        const contentA = await setupContent(usecaseUser1, {
            ...dataContent2,
            name: "Apple",
            type: dataContent1.type,
        });

        await setupContent(usecaseUser1, {
            ...dataContent2,
            type: dataContent2.type,
        });

        const contents = expectSuccess(
            await usecaseUser1.find({
                type: dataContent1.type,
                orderBy: "name",
                order: "asc",
                page: 1,
                limit: 2,
            })
        );

        expect(contents.data.map((content) => content.uid)).toEqual([contentA.uid, contentB.uid]);
    });

    test("Should order before paginate", async () => {
        await setupContent(usecaseUser1, {
            ...dataContent1,
            name: "A",
        });

        await setupContent(usecaseUser1, {
            ...dataContent1,
            name: "B",
        });

        const contentC = await setupContent(usecaseUser1, {
            ...dataContent1,
            name: "C",
        });

        const contentD = await setupContent(usecaseUser1, {
            ...dataContent1,
            name: "D",
        });

        const contents = expectSuccess(
            await usecaseUser1.find({
                orderBy: "name",
                order: "asc",
                page: 2,
                limit: 2,
            })
        );

        expect(contents.data.map((content) => content.uid)).toEqual([contentC.uid, contentD.uid]);
    });

    test("Should filter, order and paginate contents", async () => {
        const contentB = await setupContent(usecaseUser1, {
            ...dataContent1,
            name: "Banana",
            type: dataContent1.type,
        });

        const contentA = await setupContent(usecaseUser1, {
            ...dataContent2,
            name: "Apple",
            type: dataContent1.type,
        });

        await setupContent(usecaseUser1, {
            ...dataContent1,
            name: "Orange",
            type: dataContent1.type,
        });

        const contents = expectSuccess(
            await usecaseUser1.find({
                type: dataContent1.type,
                orderBy: "name",
                order: "asc",
                page: 1,
                limit: 2,
            })
        );

        expect(contents.data.map((content) => content.uid)).toEqual([contentA.uid, contentB.uid]);
    });
});

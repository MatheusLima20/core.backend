import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { ContentType } from "../../enums/content-type.enum";
import { ContentUsecase } from "../content.usecase";
import { dataContent1, dataContent2, makeContent } from "./factory/content-data.factory";
import { setupContent, setupContents } from "./setup/content-test.setup";
import { scenario } from "./setup/test-factory";

describe("ContentUsecase - find", () => {
    let usecaseUser1!: ContentUsecase;
    let usecaseUser2!: ContentUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find all platform contents", async () => {
        await setupContents(usecaseUser1, dataContent1, dataContent2);

        await setupContent(
            usecaseUser2,
            makeContent({
                title: "Laravel",
            })
        );

        const platform1Contents = expectSuccess(await usecaseUser1.find());
        const platform2Contents = expectSuccess(await usecaseUser2.find());

        expect(
            platform1Contents.every((content) => content.platformUID === user1.platformUID)
        ).toBe(true);

        expect(
            platform2Contents.every((content) => content.platformUID === user2.platformUID)
        ).toBe(true);
    });

    test("Should return empty list when platform has no contents", async () => {
        const contents = expectSuccess(await usecaseUser2.find());

        expect(contents).toEqual([]);
    });

    test("Should filter contents by title", async () => {
        await setupContents(
            usecaseUser1,
            makeContent({
                title: "Node.js",
            }),
            makeContent({
                title: "React",
            }),
            makeContent({
                title: "Advanced Node.js",
            })
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                title: "Node",
            })
        );

        expect(contents).toHaveLength(2);

        expect(contents.every((content) => content.title.includes("Node"))).toBe(true);
    });

    test("Should filter contents by description", async () => {
        await setupContents(usecaseUser1, dataContent1, {
            ...dataContent2,
            description: "Frontend Development",
        });

        const contents = expectSuccess(
            await usecaseUser1.find({
                description: "Node",
            })
        );

        expect(contents).toHaveLength(1);
    });

    test("Should filter contents by type", async () => {
        await setupContents(
            usecaseUser1,
            makeContent({
                title: "Video",
                type: ContentType.VIDEO,
            }),
            makeContent({
                title: "PDF",
                type: ContentType.PDF,
            }),
            makeContent({
                title: "Text",
                type: ContentType.TEXT,
            })
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                type: ContentType.PDF,
            })
        );

        expect(contents).toHaveLength(1);

        expect(contents.every((content) => content.type === ContentType.PDF)).toBe(true);
    });

    test("Should search contents by title and description", async () => {
        const [, , contentA, contentB] = await setupContents(
            usecaseUser1,
            dataContent1,
            dataContent2,
            makeContent({
                title: "Node Advanced",
                description: "Advanced backend",
            }),
            makeContent({
                title: "Node Expert",
                description: "Advanced backend",
            })
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                title: "Node",
                description: "Advanced",
            })
        );

        expect(contents).toHaveLength(2);

        expect(contents).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: contentA.title,
                }),
                expect.objectContaining({
                    title: contentB.title,
                }),
            ])
        );
    });

    test("Should return empty when filters match nothing", async () => {
        await setupContent(
            usecaseUser1,
            makeContent({
                title: "React",
            })
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                title: "Laravel",
            })
        );

        expect(contents).toEqual([]);
    });

    test("Should order contents by title ascending", async () => {
        await setupContents(
            usecaseUser1,
            makeContent({
                title: "Node C",
            }),
            makeContent({
                title: "Node A",
            }),
            makeContent({
                title: "Node B",
            })
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                orderBy: "title",
                order: "asc",
            })
        );

        expect(contents.map((content) => content.title)).toEqual(["Node A", "Node B", "Node C"]);
    });

    test("Should order contents by title descending", async () => {
        await setupContents(
            usecaseUser1,
            makeContent({ title: "A" }),
            makeContent({ title: "C" }),
            makeContent({ title: "B" })
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                orderBy: "title",
                order: "desc",
            })
        );

        expect(contents.map((content) => content.title)).toEqual(["C", "B", "A"]);
    });

    test("Should order contents by order ascending", async () => {
        await setupContents(
            usecaseUser1,
            makeContent({
                title: "Third",
                order: 3,
            }),
            makeContent({
                title: "First",
                order: 1,
            }),
            makeContent({
                title: "Second",
                order: 2,
            })
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                orderBy: "order",
                order: "asc",
            })
        );

        expect(contents.map((content) => content.order)).toEqual([1, 2, 3]);
    });

    test("Should order contents by order descending", async () => {
        await setupContents(
            usecaseUser1,
            makeContent({
                order: 1,
            }),
            makeContent({
                order: 3,
            }),
            makeContent({
                order: 2,
            })
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                orderBy: "order",
                order: "desc",
            })
        );

        expect(contents.map((content) => content.order)).toEqual([3, 2, 1]);
    });

    test("Should return first page", async () => {
        const [contentA, contentB] = await setupContents(
            usecaseUser1,
            makeContent({ title: "A" }),
            makeContent({ title: "B" }),
            makeContent({ title: "C" }),
            makeContent({ title: "D" }),
            makeContent({ title: "E" }),
            makeContent({ title: "F" }),
            makeContent({ title: "G" })
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(contents).toHaveLength(2);

        expect(contents.map((content) => content.title)).toEqual([contentA.title, contentB.title]);
    });

    test("Should return second page", async () => {
        const [, , contentC, contentD] = await setupContents(
            usecaseUser1,
            makeContent({ title: "A" }),
            makeContent({ title: "B" }),
            makeContent({ title: "C" }),
            makeContent({ title: "D" }),
            makeContent({ title: "E" }),
            makeContent({ title: "F" }),
            makeContent({ title: "G" })
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                page: 2,
                limit: 2,
            })
        );

        expect(contents.map((content) => content.title)).toEqual([contentC.title, contentD.title]);
    });

    test("Should return remaining contents on last page", async () => {
        const [, , , , contentE] = await setupContents(
            usecaseUser1,
            makeContent({ title: "A" }),
            makeContent({ title: "B" }),
            makeContent({ title: "C" }),
            makeContent({ title: "D" }),
            makeContent({ title: "E" })
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                page: 3,
                limit: 2,
            })
        );

        expect(contents.map((content) => content.title)).toEqual([contentE.title]);
    });

    test("Should return empty list when page does not exist", async () => {
        await setupContents(usecaseUser1, makeContent(), makeContent());

        const contents = expectSuccess(
            await usecaseUser1.find({
                page: 5,
                limit: 10,
            })
        );

        expect(contents).toEqual([]);
    });

    test("Should filter and order contents", async () => {
        const [contentB, , contentA] = await setupContents(
            usecaseUser1,
            makeContent({
                title: "Node B",
            }),
            makeContent({
                title: "React",
            }),
            makeContent({
                title: "Node A",
            })
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                title: "Node",
                orderBy: "title",
                order: "asc",
            })
        );

        expect(contents.map((content) => content.title)).toEqual([contentA.title, contentB.title]);
    });

    test("Should order before paginate", async () => {
        const [contentD, , , contentC] = await setupContents(
            usecaseUser1,
            makeContent({
                title: "Node D",
            }),
            makeContent({
                title: "Node A",
            }),
            makeContent({
                title: "Node E",
            }),
            makeContent({
                title: "Node C",
            }),
            makeContent({
                title: "Node B",
            })
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                orderBy: "title",
                order: "asc",
                page: 2,
                limit: 2,
            })
        );

        expect(contents.map((content) => content.title)).toEqual([contentC.title, contentD.title]);
    });

    test("Should filter, order and paginate contents", async () => {
        const [contentD, , , contentC] = await setupContents(
            usecaseUser1,
            makeContent({
                title: "Node D",
            }),
            makeContent({
                title: "Node E",
            }),
            makeContent({
                title: "Node A",
            }),
            makeContent({
                title: "Node C",
            }),
            makeContent({
                title: "Node B",
            })
        );

        const contents = expectSuccess(
            await usecaseUser1.find({
                title: "Node",
                orderBy: "title",
                order: "asc",
                page: 2,
                limit: 2,
            })
        );

        expect(contents.map((content) => content.title)).toEqual([contentC.title, contentD.title]);
    });
});

import { AuthUser } from "@/shared/context/auth.user";

import { ContentType } from "../../enums/content.type";
import { ContentAlreadyExistsError } from "../../errors/content-already-exists.error";
import { ContentUsecase } from "../content.usecase";
import { dataContent1, dataContent2 } from "./factories/content-data.factory";
import { expectCreateContentFailure, setupContent } from "./setup/setup-content";
import { scenario } from "./setup/test-builder";

describe("ContentUsecase - create", () => {
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

    test("Should register a content", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        expect(content).toMatchObject({
            type: dataContent1.type,
            url: dataContent1.url,
            alt: dataContent1.alt,
            name: dataContent1.name,
            mimeType: dataContent1.mimeType,
            size: dataContent1.size,

            uid: expect.any(String),

            createdAt: expect.any(Date),

            createdBy: user1.uid,
        });
    });

    test("Should register contents", async () => {
        const content1 = await setupContent(usecaseUser1, dataContent1);

        const content2 = await setupContent(usecaseUser2, dataContent2);

        expect(content1).toMatchObject({
            type: dataContent1.type,
            url: dataContent1.url,
            alt: dataContent1.alt,
            name: dataContent1.name,
            mimeType: dataContent1.mimeType,
            size: dataContent1.size,

            uid: expect.any(String),

            createdAt: expect.any(Date),

            createdBy: user1.uid,
        });

        expect(content2).toMatchObject({
            type: dataContent2.type,
            url: dataContent2.url,
            alt: dataContent2.alt,
            name: dataContent2.name,
            mimeType: dataContent2.mimeType,
            size: dataContent2.size,

            uid: expect.any(String),

            createdAt: expect.any(Date),

            createdBy: user2.uid,
        });
    });

    test("Should use the authenticated user platform", async () => {
        const content = await setupContent(usecaseUser2, {
            ...dataContent1,
        });

        expect(content).toMatchObject({
            createdBy: user2.uid,
        });
    });

    test("Should allow same content name in different platforms", async () => {
        await setupContent(usecaseUser1, dataContent1);

        await setupContent(usecaseUser2, dataContent1);
    });

    test("Should not register duplicated content", async () => {
        await setupContent(usecaseUser1, dataContent1);

        await expectCreateContentFailure(usecaseUser1, dataContent1, ContentAlreadyExistsError);
    });

    test("Should register image content", async () => {
        const content = await setupContent(usecaseUser1, {
            ...dataContent1,
            type: ContentType.IMAGE,
        });

        expect(content.type).toBe(ContentType.IMAGE);
    });

    test("Should register video content", async () => {
        const content = await setupContent(usecaseUser1, {
            ...dataContent1,
            type: ContentType.VIDEO,
        });

        expect(content.type).toBe(ContentType.VIDEO);
    });

    test("Should register file content", async () => {
        const content = await setupContent(usecaseUser1, {
            ...dataContent1,
            type: ContentType.FILE,
        });

        expect(content.type).toBe(ContentType.FILE);
    });

    test("Should register content with alt", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        expect(content.alt).toBe(dataContent1.alt);
    });

    test("Should register content without alt", async () => {
        const content = await setupContent(usecaseUser1, {
            ...dataContent1,
            alt: null,
        });

        expect(content.alt).toBeNull();
    });
});

import { AuthUser } from "@/shared/context/auth.user";

import { ContentAlreadyExistsError } from "../../errors/content-already-exists.error";
import { ContentUsecase } from "../content.usecase";
import { dataContent1, dataContent2 } from "./factory/content-data.factory";
import { expectCreateContentFailure, setupContent } from "./setup/content-test.setup";
import { scenario } from "./setup/test-factory";

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
        const [contentA, contentB] = await Promise.all([
            setupContent(usecaseUser1, dataContent1),
            setupContent(usecaseUser2, dataContent2),
        ]);

        expect(contentA).toMatchObject({
            lessonUID: dataContent1.lessonUID,
            title: dataContent1.title,
            description: dataContent1.description,
            type: dataContent1.type,
            order: dataContent1.order,
            isPreview: dataContent1.isPreview,

            platformUID: user1.platformUID,
            createdBy: user1.uid,

            uid: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });

        expect(contentB).toMatchObject({
            lessonUID: dataContent2.lessonUID,
            title: dataContent2.title,
            description: dataContent2.description,
            type: dataContent2.type,
            order: dataContent2.order,
            isPreview: dataContent2.isPreview,

            platformUID: user2.platformUID,
            createdBy: user2.uid,

            uid: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });

    test("Should allow same content title in different platforms", async () => {
        await setupContent(usecaseUser1, dataContent1);

        await setupContent(usecaseUser2, dataContent1);
    });

    test("Should not register duplicated content", async () => {
        await setupContent(usecaseUser1, dataContent1);

        await expectCreateContentFailure(usecaseUser1, dataContent1, ContentAlreadyExistsError);
    });

    test("Should register preview content", async () => {
        const content = await setupContent(usecaseUser1, {
            ...dataContent1,
            isPreview: true,
        });

        expect(content.isPreview).toBe(true);
    });

    test("Should register non preview content", async () => {
        const content = await setupContent(usecaseUser1, {
            ...dataContent1,
            isPreview: false,
        });

        expect(content.isPreview).toBe(false);
    });
});

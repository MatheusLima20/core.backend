import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { ContentNotFoundError } from "../../errors/content-not-found.error";
import { ContentUsecase } from "../content.usecase";
import { dataContent1, dataContent2 } from "./factory/content-data.factory";
import { setupContent, setupContents } from "./setup/content-test.setup";
import { scenario } from "./setup/test-factory";

describe("ContentUsecase - findByUID", () => {
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

    test("Should find a content by uid", async () => {
        const [, , createdContent] = await setupContents(usecaseUser1, dataContent1, dataContent2, {
            ...dataContent1,
            title: "PDF Content",
            description: "Introduction PDF",
            order: 3,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(createdContent.uid));

        expect(found).toMatchObject({
            uid: createdContent.uid,
            lessonUID: createdContent.lessonUID,
            title: createdContent.title,
            description: createdContent.description,
            type: createdContent.type,
            order: createdContent.order,
            isPreview: createdContent.isPreview,
            platformUID: createdContent.platformUID,
            createdBy: createdContent.createdBy,
            createdAt: createdContent.createdAt,
            updatedAt: createdContent.updatedAt,
        });
    });

    test("Should return ContentNotFoundError when uid does not exist", async () => {
        expectFailure(await usecaseUser1.findByUID("invalid-uid"), ContentNotFoundError);
    });

    test("Should not find a content from another platform", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        expectFailure(await usecaseUser2.findByUID(content.uid), ContentNotFoundError);
    });

    test("Should return all persisted content data", async () => {
        const content = await setupContent(usecaseUser1, {
            ...dataContent1,
            title: "Video Lesson",
            description: "Introduction video",
            order: 5,
            isPreview: true,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(content.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: content.uid,
                lessonUID: content.lessonUID,
                title: "Video Lesson",
                description: "Introduction video",
                type: content.type,
                order: 5,
                isPreview: true,
                platformUID: user1.platformUID,
                createdBy: user1.uid,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        );

        expect(found.createdBy).not.toEqual(user2.uid);
    });
});

import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { UpdateContentDTO } from "../../dtos/update-content.dto";
import { ContentType } from "../../enums/content-type.enum";
import { ContentAlreadyExistsError } from "../../errors/content-already-exists.error";
import { ContentNotFoundError } from "../../errors/content-not-found.error";
import { ContentUsecase } from "../content.usecase";
import { dataContent1, dataContent2 } from "./factory/content-data.factory";
import { setupContent, setupContents } from "./setup/content-test.setup";
import { scenario } from "./setup/test-factory";

describe("ContentUsecase - update", () => {
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

    test("Should update a content", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        const data: UpdateContentDTO = {
            uid: content.uid,
            lessonUID: content.lessonUID,
            title: "Node.js Advanced",
            description: "Advanced Node.js concepts.",
            type: ContentType.PDF,
            order: 5,
            isPreview: true,
        };

        const updated = expectSuccess(await usecaseUser1.update(data));

        expect(updated).toMatchObject({
            uid: content.uid,
            lessonUID: data.lessonUID,
            title: data.title,
            description: data.description,
            type: data.type,
            order: data.order,
            isPreview: data.isPreview,
            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(content.uid));

        expect(found).toMatchObject({
            uid: content.uid,
            lessonUID: data.lessonUID,
            title: data.title,
            description: data.description,
            type: data.type,
            order: data.order,
            isPreview: data.isPreview,
            updatedBy: user1.uid,
        });

        expect(found.updatedBy).not.toEqual(user2.uid);
    });

    test("Should update only description", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...content,
                description: "Updated description.",
            })
        );

        expect(updated.title).toBe(content.title);
        expect(updated.description).toBe("Updated description.");
        expect(updated.type).toBe(content.type);
        expect(updated.order).toBe(content.order);
        expect(updated.isPreview).toBe(content.isPreview);
    });

    test("Should update content type", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...content,
                type: ContentType.VIDEO,
            })
        );

        expect(updated.type).toBe(ContentType.VIDEO);
        expect(updated.title).toBe(content.title);
    });

    test("Should update content order", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...content,
                order: 10,
            })
        );

        expect(updated.order).toBe(10);
    });

    test("Should update preview flag", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...content,
                isPreview: !content.isPreview,
            })
        );

        expect(updated.isPreview).toBe(!content.isPreview);
    });

    test("Should keep the same title", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...content,
                description: "Updated description.",
            })
        );

        expect(updated.title).toBe(content.title);
    });

    test("Should not update duplicated content title", async () => {
        const [content] = await setupContents(usecaseUser1, dataContent1, dataContent2);

        expectFailure(
            await usecaseUser1.update({
                ...content,
                title: dataContent2.title,
            }),
            ContentAlreadyExistsError
        );
    });

    test("Should not update an inexistent content", async () => {
        expectFailure(
            await usecaseUser1.update({
                ...dataContent1,
                uid: "invalid-content",
                title: "Node.js",
            }),
            ContentNotFoundError
        );
    });

    test("Should not update content from another platform", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        expectFailure(
            await usecaseUser2.update({
                ...content,
                title: "Unauthorized update",
            }),
            ContentNotFoundError
        );
    });

    test("Should update lesson", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...content,
                lessonUID: "new-lesson",
            })
        );

        expect(updated.lessonUID).toBe("new-lesson");
    });
});

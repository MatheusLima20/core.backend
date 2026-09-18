import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { UpdateContentDTO } from "../../dtos/update-content.dto";
import { ContentType } from "../../enums/content.type";
import { ContentAlreadyExistsError } from "../../errors/content-already-exists.error";
import { ContentNotFoundError } from "../../errors/content-not-found.error";
import { ContentUsecase } from "../content.usecase";
import { dataContent1 } from "./factories/content-data.factory";
import { setupContent } from "./setup/setup-content";
import { scenario } from "./setup/test-builder";

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
            name: "Updated Content",
            type: ContentType.VIDEO,
            url: "https://example.com/updated-video.mp4",
            alt: "Updated content",
            mimeType: "video/mp4",
            size: 204800,
        };

        const updated = expectSuccess(await usecaseUser1.update(data));

        expect(updated).toMatchObject({
            uid: content.uid,
            name: data.name,
            type: data.type,
            url: data.url,
            alt: data.alt,
            mimeType: data.mimeType,
            size: data.size,
            updatedAt: updated.updatedAt,
            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(content.uid));

        expect(found).toMatchObject({
            uid: updated.uid,
            name: updated.name,
            type: updated.type,
            url: updated.url,
            alt: updated.alt,
            mimeType: updated.mimeType,
            size: updated.size,
            updatedAt: updated.updatedAt,
            updatedBy: user1.uid,
        });

        expect(found.updatedBy).not.toBe(user2.uid);
    });

    test("Should update only name", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: content.uid,
                name: "New Content Name",
            })
        );

        expect(updated.name).toBe("New Content Name");
    });

    test("Should update only url", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: content.uid,
                url: "https://example.com/new-image.jpg",
            })
        );

        expect(updated.url).toBe("https://example.com/new-image.jpg");
    });

    test("Should update only alt", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: content.uid,
                alt: "New alternative text",
            })
        );

        expect(updated.alt).toBe("New alternative text");
    });

    test("Should update only type", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: content.uid,
                type: ContentType.VIDEO,
            })
        );

        expect(updated.type).toBe(ContentType.VIDEO);
    });

    test("Should update only mime type", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: content.uid,
                mimeType: "image/webp",
            })
        );

        expect(updated.mimeType).toBe("image/webp");
    });

    test("Should update only size", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: content.uid,
                size: 512000,
            })
        );

        expect(updated.size).toBe(512000);
    });

    test("Should not update an inexistent content", async () => {
        expectFailure(
            await usecaseUser1.update({
                uid: "invalid-content",
                name: "Content",
            }),
            ContentNotFoundError
        );
    });

    test("Should not update content from another platform", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        expectFailure(
            await usecaseUser2.update({
                uid: content.uid,
                name: "Updated",
            }),
            ContentNotFoundError
        );
    });

    test("Should not update to a duplicated content name", async () => {
        const content1 = await setupContent(usecaseUser1, dataContent1);

        const content2 = await setupContent(usecaseUser1, {
            ...dataContent1,
            name: "Another Content",
        });

        expectFailure(
            await usecaseUser1.update({
                uid: content2.uid,
                name: content1.name,
            }),
            ContentAlreadyExistsError
        );
    });
});

import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { ContentNotFoundError } from "../../errors/content-not-found.error";
import { ContentUsecase } from "../content.usecase";
import { dataContent1 } from "./factories/content-data.factory";
import { setupContent } from "./setup/setup-content";
import { scenario } from "./setup/test-builder";

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
        const content = await setupContent(usecaseUser1, dataContent1);

        const found = expectSuccess(await usecaseUser1.findByUID(content.uid));

        expect(found).toMatchObject({
            uid: content.uid,

            type: dataContent1.type,

            url: dataContent1.url,

            alt: dataContent1.alt,

            name: dataContent1.name,

            mimeType: dataContent1.mimeType,

            size: dataContent1.size,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            createdAt: content.createdAt,
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
        const content = await setupContent(usecaseUser1, dataContent1);

        const found = expectSuccess(await usecaseUser1.findByUID(content.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: content.uid,

                type: dataContent1.type,

                url: dataContent1.url,

                alt: dataContent1.alt,

                name: dataContent1.name,

                mimeType: dataContent1.mimeType,

                size: dataContent1.size,

                platformUID: user1.platformUID,

                createdBy: user1.uid,

                createdAt: expect.any(Date),
            })
        );

        expect(found.createdBy).not.toBe(user2.uid);
    });
});

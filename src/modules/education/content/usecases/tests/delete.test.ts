import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { ContentNotFoundError } from "../../errors/content-not-found.error";
import { ContentUsecase } from "../content.usecase";
import { dataContent1, dataContent2 } from "./factory/content-data.factory";
import { setupContent, setupContents } from "./setup/content-test.setup";
import { scenario } from "./setup/test-factory";

describe("ContentUsecase - delete", () => {
    let usecaseUser1!: ContentUsecase;
    let usecaseUser2!: ContentUsecase;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should delete a content", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        const before = expectSuccess(await usecaseUser1.find());

        expectSuccess(await usecaseUser1.delete(content.uid));

        const after = expectSuccess(await usecaseUser1.find());

        expect(before).toHaveLength(1);
        expect(after).toHaveLength(0);

        expectFailure(await usecaseUser1.findByUID(content.uid), ContentNotFoundError);
    });

    test("Should delete only selected content", async () => {
        const [contentA, contentB] = await setupContents(usecaseUser1, dataContent1, dataContent2);

        expectSuccess(await usecaseUser1.delete(contentA.uid));

        expectFailure(await usecaseUser1.findByUID(contentA.uid), ContentNotFoundError);

        const remaining = expectSuccess(await usecaseUser1.findByUID(contentB.uid));

        expect(remaining.uid).toBe(contentB.uid);
    });

    test("Should not delete an inexistent content", async () => {
        expectFailure(await usecaseUser1.delete("invalid-content"), ContentNotFoundError);
    });

    test("Should not delete content from another platform", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        expectFailure(await usecaseUser2.delete(content.uid), ContentNotFoundError);

        expectSuccess(await usecaseUser1.findByUID(content.uid));
    });

    test("Should delete one content keeping remaining contents", async () => {
        const [, contentB, contentC] = await setupContents(
            usecaseUser1,
            dataContent1,
            dataContent2,
            {
                ...dataContent1,
                title: "PDF Content",
                lessonUID: dataContent1.lessonUID,
                order: 3,
            }
        );

        expectSuccess(await usecaseUser1.delete(contentB.uid));

        const contents = expectSuccess(await usecaseUser1.find());

        expect(contents).toHaveLength(2);

        expect(contents.map((content) => content.uid)).toEqual(
            expect.arrayContaining([
                contentC.uid,
                contents.find((c) => c.uid !== contentC.uid)!.uid,
            ])
        );

        expectFailure(await usecaseUser1.findByUID(contentB.uid), ContentNotFoundError);
    });
});

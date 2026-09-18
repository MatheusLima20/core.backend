import { ContentUsecase } from "../content.usecase";
import { dataContent1 } from "./factories/content-data.factory";
import { setupContent } from "./setup/setup-content";
import { scenario } from "./setup/test-builder";

describe("ContentUsecase - delete", () => {
    let usecaseUser1!: ContentUsecase;
    let usecaseUser2!: ContentUsecase;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should delete content", async () => {
        const content = await setupContent(usecaseUser1, dataContent1);

        const result = await usecaseUser1.delete(content.uid);

        expect(result.success).toBe(true);

        const deleted = await usecaseUser1.findByUID(content.uid);

        expect(deleted.success).toBe(false);
    });

    test("Should return not found when content does not exist", async () => {
        const result = await usecaseUser1.delete("invalid-content-uid");

        expect(result.success).toBe(false);
    });

    test("Should not delete content from another platform", async () => {
        const content = await setupContent(usecaseUser2, dataContent1);

        const result = await usecaseUser1.delete(content.uid);

        expect(result.success).toBe(false);

        const existing = await usecaseUser2.findByUID(content.uid);

        expect(existing.success).toBe(true);
    });
});

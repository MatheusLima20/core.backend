import { CategoryUsecase } from "../category.usecase";
import { dataCategory1 } from "./factories/category-data.factory";
import { scenario } from "./setup/category.builder";
import { setupCategory } from "./setup/category.setup";

describe("CategoryUsecase - delete", () => {
    let usecaseUser1!: CategoryUsecase;
    let usecaseUser2!: CategoryUsecase;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should delete category", async () => {
        const category = await setupCategory(usecaseUser1, dataCategory1);

        const result = await usecaseUser1.delete(category.uid);

        expect(result.success).toBe(true);

        const deleted = await usecaseUser1.findByUID(category.uid);

        expect(deleted.success).toBe(false);
    });

    test("Should return not found when category does not exist", async () => {
        const result = await usecaseUser1.delete("invalid-category-uid");

        expect(result.success).toBe(false);
    });

    test("Should not delete category from another platform", async () => {
        const category = await setupCategory(usecaseUser2, dataCategory1);

        const result = await usecaseUser1.delete(category.uid);

        expect(result.success).toBe(false);

        const existing = await usecaseUser2.findByUID(category.uid);

        expect(existing.success).toBe(true);
    });
});

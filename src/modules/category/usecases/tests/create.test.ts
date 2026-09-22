import { AuthUser } from "@/shared/context/auth.user";

import { CategoryAlreadyExistsError } from "../../errors/category-already-exists.error";
import { CategoryUsecase } from "../category.usecase";
import { dataCategory1, dataCategory2 } from "./factories/category-data.factory";
import { scenario } from "./setup/category.builder";
import { expectCreateCategoryFailure, setupCategory } from "./setup/category.setup";

describe("CategoryUsecase - create", () => {
    let usecaseUser1!: CategoryUsecase;
    let usecaseUser2!: CategoryUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should register a category", async () => {
        const category = await setupCategory(usecaseUser1, dataCategory1);

        expect(category).toMatchObject({
            name: dataCategory1.name,
            description: dataCategory1.description,

            uid: expect.any(String),

            createdAt: expect.any(Date),

            createdBy: user1.uid,
        });
    });

    test("Should register categories", async () => {
        const category1 = await setupCategory(usecaseUser1, dataCategory1);

        const category2 = await setupCategory(usecaseUser2, dataCategory2);

        expect(category1).toMatchObject({
            name: dataCategory1.name,
            description: dataCategory1.description,

            uid: expect.any(String),

            createdAt: expect.any(Date),

            createdBy: user1.uid,
        });

        expect(category2).toMatchObject({
            name: dataCategory2.name,
            description: dataCategory2.description,

            uid: expect.any(String),

            createdAt: expect.any(Date),

            createdBy: user2.uid,
        });
    });

    test("Should use the authenticated user platform", async () => {
        const category = await setupCategory(usecaseUser2, {
            ...dataCategory1,
        });

        expect(category).toMatchObject({
            createdBy: user2.uid,
        });
    });

    test("Should allow same category name in different platforms", async () => {
        await setupCategory(usecaseUser1, dataCategory1);

        await setupCategory(usecaseUser2, dataCategory1);
    });

    test("Should not register duplicated category", async () => {
        await setupCategory(usecaseUser1, dataCategory1);

        await expectCreateCategoryFailure(usecaseUser1, dataCategory1, CategoryAlreadyExistsError);
    });

    test("Should register category with description", async () => {
        const category = await setupCategory(usecaseUser1, dataCategory1);

        expect(category.description).toBe(dataCategory1.description);
    });

    test("Should register category without description", async () => {
        const category = await setupCategory(usecaseUser1, {
            ...dataCategory1,
            description: null,
        });

        expect(category.description).toBeNull();
    });
});

import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CategoryNotFoundError } from "../../errors/category-not-found.error";
import { CategoryUsecase } from "../category.usecase";
import { dataCategory1 } from "./factories/category-data.factory";
import { scenario } from "./setup/category.builder";
import { setupCategory } from "./setup/category.setup";

describe("CategoryUsecase - findByUID", () => {
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

    test("Should find a category by uid", async () => {
        const category = await setupCategory(usecaseUser1, dataCategory1);

        const found = expectSuccess(await usecaseUser1.findByUID(category.uid));

        expect(found).toMatchObject({
            uid: category.uid,

            name: dataCategory1.name,

            description: dataCategory1.description,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            createdAt: category.createdAt,
        });
    });

    test("Should return CategoryNotFoundError when uid does not exist", async () => {
        expectFailure(await usecaseUser1.findByUID("invalid-uid"), CategoryNotFoundError);
    });

    test("Should not find a category from another platform", async () => {
        const category = await setupCategory(usecaseUser1, dataCategory1);

        expectFailure(await usecaseUser2.findByUID(category.uid), CategoryNotFoundError);
    });

    test("Should return all persisted category data", async () => {
        const category = await setupCategory(usecaseUser1, dataCategory1);

        const found = expectSuccess(await usecaseUser1.findByUID(category.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: category.uid,

                name: dataCategory1.name,

                description: dataCategory1.description,

                platformUID: user1.platformUID,

                createdBy: user1.uid,

                createdAt: expect.any(Date),
            })
        );

        expect(found.createdBy).not.toBe(user2.uid);
    });
});

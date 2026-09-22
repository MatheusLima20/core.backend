import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { UpdateCategoryDTO } from "../../dtos/update-category.dto";
import { CategoryAlreadyExistsError } from "../../errors/category-already-exists.error";
import { CategoryNotFoundError } from "../../errors/category-not-found.error";
import { CategoryUsecase } from "../category.usecase";
import { dataCategory1 } from "./factories/category-data.factory";
import { scenario } from "./setup/category.builder";
import { setupCategory } from "./setup/category.setup";

describe("CategoryUsecase - update", () => {
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

    test("Should update a category", async () => {
        const category = await setupCategory(usecaseUser1, dataCategory1);

        const data: UpdateCategoryDTO = {
            uid: category.uid,
            name: "Updated Category",
            description: "Updated description",
        };

        const updated = expectSuccess(await usecaseUser1.update(data));

        expect(updated).toMatchObject({
            uid: category.uid,
            name: data.name,
            description: data.description,
            updatedAt: updated.updatedAt,
            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(category.uid));

        expect(found).toMatchObject({
            uid: updated.uid,
            name: updated.name,
            description: updated.description,
            updatedAt: updated.updatedAt,
            updatedBy: user1.uid,
        });

        expect(found.updatedBy).not.toBe(user2.uid);
    });

    test("Should update only name", async () => {
        const category = await setupCategory(usecaseUser1, dataCategory1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: category.uid,
                name: "New Category Name",
            })
        );

        expect(updated.name).toBe("New Category Name");
        expect(updated.description).toBe(dataCategory1.description);
    });

    test("Should update only description", async () => {
        const category = await setupCategory(usecaseUser1, dataCategory1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: category.uid,
                description: "New category description",
            })
        );

        expect(updated.description).toBe("New category description");
        expect(updated.name).toBe(dataCategory1.name);
    });

    test("Should update description to null", async () => {
        const category = await setupCategory(usecaseUser1, dataCategory1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: category.uid,
                description: null,
            })
        );

        expect(updated.description).toBeNull();
    });

    test("Should not update an inexistent category", async () => {
        expectFailure(
            await usecaseUser1.update({
                uid: "invalid-category",
                name: "Category",
            }),
            CategoryNotFoundError
        );
    });

    test("Should not update category from another platform", async () => {
        const category = await setupCategory(usecaseUser1, dataCategory1);

        expectFailure(
            await usecaseUser2.update({
                uid: category.uid,
                name: "Updated",
            }),
            CategoryNotFoundError
        );
    });

    test("Should not update to a duplicated category name", async () => {
        const category1 = await setupCategory(usecaseUser1, dataCategory1);

        const category2 = await setupCategory(usecaseUser1, {
            ...dataCategory1,
            name: "Another Category",
        });

        expectFailure(
            await usecaseUser1.update({
                uid: category2.uid,
                name: category1.name,
            }),
            CategoryAlreadyExistsError
        );
    });
});

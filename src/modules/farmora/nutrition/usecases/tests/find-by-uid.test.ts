import { expectSuccess } from "@/shared/tests/result.helper";

import { InMemoryNutritionRepository } from "../../repositories/implementations/in-memory-nutrition.repository";
import { NutritionUsecase } from "../nutrition.usecase";

describe("NutritionUsecase - findByUID", () => {
    let usecase: NutritionUsecase;

    beforeEach(() => {
        usecase = new NutritionUsecase(new InMemoryNutritionRepository());
    });

    test("Should find a nutrition by uid", async () => {
        const found = expectSuccess(await usecase.findByUID("nutrition-1"));

        expect(found).toMatchObject({
            uid: "nutrition-1",

            name: "Inicial",

            startWeek: 1,
            endWeek: 6,

            minimumCrudeProtein: 20,
            maximumCrudeProtein: 22,

            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });

    test("Should return null when uid does not exist", async () => {
        const found = expectSuccess(await usecase.findByUID("invalid-uid"));

        expect(found).toBeNull();
    });

    test("Should return all persisted nutrition data", async () => {
        const found = expectSuccess(await usecase.findByUID("nutrition-4"));

        expect(found).toEqual(
            expect.objectContaining({
                uid: "nutrition-4",

                name: "Postura",

                startWeek: 19,
                endWeek: 80,

                minimumCrudeProtein: 16,
                maximumCrudeProtein: 18,

                calcium: 3.9,

                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        );
    });
});

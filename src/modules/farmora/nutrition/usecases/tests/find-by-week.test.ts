import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { NutritionNotFoundError } from "../../errors/nutrition-not-found.error";
import { InMemoryNutritionRepository } from "../../repositories/implementations/in-memory-nutrition.repository";
import { NutritionUsecase } from "../nutrition.usecase";

describe("NutritionUsecase - findByWeek", () => {
    let usecase: NutritionUsecase;

    beforeEach(() => {
        usecase = new NutritionUsecase(new InMemoryNutritionRepository());
    });

    test("Should find nutrition by first week", async () => {
        const found = expectSuccess(await usecase.findByWeek(1));

        expect(found?.name).toBe("Inicial");
    });

    test("Should find nutrition by middle week", async () => {
        const found = expectSuccess(await usecase.findByWeek(23));

        expect(found?.name).toBe("Postura");
    });

    test("Should find nutrition by last week", async () => {
        const found = expectSuccess(await usecase.findByWeek(80));

        expect(found?.name).toBe("Postura");
    });

    test("Should return not found when week does not exist", async () => {
        expectFailure(await usecase.findByWeek(100), NutritionNotFoundError);
    });
});

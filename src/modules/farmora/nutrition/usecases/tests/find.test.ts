import { expectSuccess } from "@/shared/tests/result.helper";

import { InMemoryNutritionRepository } from "../../repositories/implementations/in-memory-nutrition.repository";
import { NutritionUsecase } from "../nutrition.usecase";

describe("NutritionUsecase - find", () => {
    let usecase: NutritionUsecase;

    beforeEach(() => {
        usecase = new NutritionUsecase(new InMemoryNutritionRepository());
    });

    test("Should return all nutritious", async () => {
        const nutritious = expectSuccess(await usecase.find());

        expect(nutritious).toHaveLength(4);
    });

    test("Should filter by name", async () => {
        const nutritious = expectSuccess(
            await usecase.find({
                name: "Postura",
            })
        );

        expect(nutritious).toHaveLength(1);
        expect(nutritious[0].name).toBe("Postura");
    });

    test("Should filter by start week", async () => {
        const nutritious = expectSuccess(
            await usecase.find({
                startWeek: 19,
            })
        );

        expect(nutritious).toHaveLength(1);
        expect(nutritious[0].name).toBe("Postura");
    });

    test("Should filter by end week", async () => {
        const nutritious = expectSuccess(
            await usecase.find({
                endWeek: 6,
            })
        );

        expect(nutritious).toHaveLength(1);
        expect(nutritious[0].name).toBe("Inicial");
    });

    test("Should return empty list when no nutrition matches filters", async () => {
        const nutritious = expectSuccess(
            await usecase.find({
                name: "Inexistente",
            })
        );

        expect(nutritious).toEqual([]);
    });

    test("Should order nutritious by minimum crude protein descending", async () => {
        const nutritious = expectSuccess(
            await usecase.find({
                orderBy: "minimumCrudeProtein",
                order: "desc",
            })
        );

        expect(nutritious[0].minimumCrudeProtein).toBeGreaterThanOrEqual(
            nutritious[1].minimumCrudeProtein
        );
    });

    test("Should paginate nutritious", async () => {
        const nutritious = expectSuccess(
            await usecase.find({
                page: 1,
                limit: 2,
            })
        );

        expect(nutritious).toHaveLength(2);
    });
});

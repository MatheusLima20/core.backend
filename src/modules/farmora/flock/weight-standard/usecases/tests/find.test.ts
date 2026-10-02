import { expectSuccess } from "@/shared/tests/result.helper";

import { InMemoryWeightStandardRepository } from "../../repositories/implementations/in-memory-weight-standard.repository";
import { WeightStandardUsecase } from "../weight-standard.usecase";

describe("WeightStandardUsecase - find", () => {
    let usecase: WeightStandardUsecase;

    beforeEach(() => {
        usecase = new WeightStandardUsecase(new InMemoryWeightStandardRepository());
    });

    test("Should return all weight standards", async () => {
        const weightStandards = expectSuccess(await usecase.find());

        expect(weightStandards.data).toHaveLength(6);
    });

    test("Should filter by breed", async () => {
        const weightStandards = expectSuccess(
            await usecase.find({
                breed: "Isa Brown",
            })
        );

        expect(weightStandards.data).toHaveLength(3);
        expect(
            weightStandards.data.every((weightStandard) => weightStandard.breed === "Isa Brown")
        ).toBe(true);
    });

    test("Should filter by week", async () => {
        const weightStandards = expectSuccess(
            await usecase.find({
                week: 20,
            })
        );

        expect(weightStandards.data).toHaveLength(2);
    });

    test("Should filter by breed and week", async () => {
        const weightStandards = expectSuccess(
            await usecase.find({
                breed: "Isa Brown",
                week: 20,
            })
        );

        expect(weightStandards.data).toHaveLength(1);
        expect(weightStandards.data[0].breed).toBe("Isa Brown");
        expect(weightStandards.data[0].week).toBe(20);
    });

    test("Should return empty list when no weight standard matches filters", async () => {
        const weightStandards = expectSuccess(
            await usecase.find({
                breed: "Inexistente",
            })
        );

        expect(weightStandards.data).toEqual([]);
    });

    test("Should order weight standards by target weight descending", async () => {
        const weightStandards = expectSuccess(
            await usecase.find({
                orderBy: "targetWeight",
                order: "desc",
            })
        );

        expect(weightStandards.data[0].targetWeight).toBeGreaterThanOrEqual(
            weightStandards.data[1].targetWeight
        );
    });

    test("Should paginate weight standards", async () => {
        const weightStandards = expectSuccess(
            await usecase.find({
                page: 1,
                limit: 2,
            })
        );

        expect(weightStandards.data).toHaveLength(2);
    });
});

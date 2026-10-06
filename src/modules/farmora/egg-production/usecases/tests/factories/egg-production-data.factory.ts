import { CreateEggProductionDTO } from "../../../dtos/create-egg-production.dto";

export const production1: CreateEggProductionDTO = {
    flockUID: "flk-test-1",
    productionDate: new Date("2026-07-01"),
    totalEggs: 90,

    dirtyEggs: 3,
    crackedEggs: 1,
    discardedEggs: 1,
    notes: "Normal production.",
};

export const production2: CreateEggProductionDTO = {
    flockUID: "flk-test-1",
    productionDate: new Date("2026-07-02"),
    totalEggs: 50,

    dirtyEggs: 2,
    crackedEggs: 0,
    discardedEggs: 0,
    notes: "Excellent production.",
};

export const production3: CreateEggProductionDTO = {
    flockUID: "flk-test-2",
    productionDate: new Date("2026-07-01"),
    totalEggs: 70,

    dirtyEggs: 2,
    crackedEggs: 1,
    discardedEggs: 2,
    notes: "Lower production.",
};

export const production4: CreateEggProductionDTO = {
    flockUID: "flk-test-1",
    productionDate: new Date("2026-07-03"),
    totalEggs: 80,

    dirtyEggs: 1,
    crackedEggs: 0,
    discardedEggs: 0,
    notes: "Recovered production.",
};

export const production5: CreateEggProductionDTO = {
    flockUID: "flk-test-3",
    productionDate: new Date("2026-07-03"),
    totalEggs: 50,

    dirtyEggs: 1,
    crackedEggs: 0,
    discardedEggs: 0,
    notes: "Recovered production.",
};

export function makeEggProduction(data?: Partial<CreateEggProductionDTO>): CreateEggProductionDTO {
    return {
        ...production1,
        ...data,
    };
}

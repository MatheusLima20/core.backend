import { CreateEggProductionDTO } from "../../../dtos/create-egg-production.dto";

export const production1: CreateEggProductionDTO = {
    flockUID: "flock-1",
    productionDate: new Date("2026-07-01"),
    totalEggs: 110,

    dirtyEggs: 3,
    crackedEggs: 1,
    discardedEggs: 1,
    notes: "Normal production.",
};

export const production2: CreateEggProductionDTO = {
    flockUID: "flock-1",
    productionDate: new Date("2026-07-02"),
    totalEggs: 115,

    dirtyEggs: 2,
    crackedEggs: 0,
    discardedEggs: 0,
    notes: "Excellent production.",
};

export const production3: CreateEggProductionDTO = {
    flockUID: "flock-2",
    productionDate: new Date("2026-07-01"),
    totalEggs: 72,

    dirtyEggs: 2,
    crackedEggs: 1,
    discardedEggs: 2,
    notes: "Lower production.",
};

export const production4: CreateEggProductionDTO = {
    flockUID: "flock-2",
    productionDate: new Date("2026-07-03"),
    totalEggs: 80,

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

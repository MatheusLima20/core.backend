import { CreateMortalityDTO } from "../../../dtos/create-mortality.dto";
import { MortalityCause } from "../../../enums/mortality-cause.enum";

export const mortality1: CreateMortalityDTO = {
    flockUID: "flock-1",
    mortalityDate: new Date("2026-07-01"),
    quantity: 2,
    cause: MortalityCause.DISEASE,
    notes: "Two birds found dead during morning inspection.",
};

export const mortality2: CreateMortalityDTO = {
    flockUID: "flock-1",
    mortalityDate: new Date("2026-07-02"),
    quantity: 1,
    cause: MortalityCause.PREDATOR,
    notes: "Predator attack overnight.",
};

export const mortality3: CreateMortalityDTO = {
    flockUID: "flock-2",
    mortalityDate: new Date("2026-07-01"),
    quantity: 3,
    cause: MortalityCause.HEAT_STRESS,
    notes: "High temperature during the afternoon.",
};

export const mortality4: CreateMortalityDTO = {
    flockUID: "flock-2",
    mortalityDate: new Date("2026-07-03"),
    quantity: 1,
    cause: MortalityCause.ACCIDENT,
    notes: "Accidental death during handling.",
};

export function makeMortality(data?: Partial<CreateMortalityDTO>): CreateMortalityDTO {
    return {
        ...mortality1,
        ...data,
    };
}

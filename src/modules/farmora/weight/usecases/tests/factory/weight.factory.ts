import { CreateWeightDTO } from "../../../dtos/create-weight.dto";

export const weight1: CreateWeightDTO = {
    flockUID: "flock-uid-1",
    weighingDate: new Date("2026-01-10"),
    averageWeight: 1850,
    sampleSize: 50,
    notes: "First weighing.",
};

export const weight2: CreateWeightDTO = {
    flockUID: "flock-uid-2",
    weighingDate: new Date("2026-02-15"),
    averageWeight: 1920,
    sampleSize: 50,
    notes: "Second weighing.",
};

export const weight3: CreateWeightDTO = {
    flockUID: "flock-uid-3",
    weighingDate: new Date("2026-03-20"),
    averageWeight: 2100,
    sampleSize: 100,
    notes: "Routine weighing.",
};

export const weight4: CreateWeightDTO = {
    flockUID: "flock-uid-4",
    weighingDate: new Date("2026-04-25"),
    averageWeight: 2250,
    sampleSize: 50,
    notes: "Final weighing.",
};

export function makeWeight(data?: Partial<CreateWeightDTO>): CreateWeightDTO {
    return {
        ...weight1,
        ...data,
    };
}

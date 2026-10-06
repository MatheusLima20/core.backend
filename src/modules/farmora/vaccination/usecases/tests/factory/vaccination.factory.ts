import { CreateVaccinationDTO } from "../../../dtos/create-vaccination.dto";

export const vaccination1: CreateVaccinationDTO = {
    flockUID: "flock-uid-1",
    itemUID: "item-uid-1",
    applicationDate: new Date("2026-01-10"),
    dose: "1 dose",
    batch: "LOT-001",
    nextDoseDate: new Date("2026-02-10"),
    notes: "First vaccination.",
};

export const vaccination2: CreateVaccinationDTO = {
    flockUID: "flock-uid-2",
    itemUID: "item-uid-2",
    applicationDate: new Date("2026-02-15"),
    dose: "1 dose",
    batch: "LOT-002",
    nextDoseDate: new Date("2026-03-15"),
    notes: "Booster vaccination.",
};

export const vaccination3: CreateVaccinationDTO = {
    flockUID: "flock-uid-3",
    itemUID: "item-uid-3",
    applicationDate: new Date("2026-03-20"),
    dose: "0.5 dose",
    batch: "LOT-003",
    notes: "Routine vaccination.",
};

export const vaccination4: CreateVaccinationDTO = {
    flockUID: "flock-uid-4",
    itemUID: "item-uid-4",
    applicationDate: new Date("2026-04-25"),
    dose: "1 dose",
    batch: "LOT-004",
    nextDoseDate: new Date("2026-05-25"),
    notes: "Emergency vaccination.",
};

export function makeVaccination(data?: Partial<CreateVaccinationDTO>): CreateVaccinationDTO {
    return {
        ...vaccination1,
        ...data,
    };
}

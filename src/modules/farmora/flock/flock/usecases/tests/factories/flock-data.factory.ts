import { CreateFlockDTO } from "../../../dtos/create-flock.dto";
import { FlockStatus } from "../../../enums/flock-status.enum";

export const activeFlock: CreateFlockDTO = {
    name: "Lote A",
    quantity: 120,
    birthDate: new Date("2026-01-01"),
    arrivalDate: new Date("2026-05-15"),
    status: FlockStatus.ACTIVE,
    description: "Main production flock.",
};

export const closedFlock: CreateFlockDTO = {
    name: "Lote B",
    quantity: 80,
    birthDate: new Date("2025-03-01"),
    arrivalDate: new Date("2025-07-10"),
    status: FlockStatus.CLOSED,
    description: "Retired flock.",
};

export const smallFlock: CreateFlockDTO = {
    name: "Lote Pequeno",
    quantity: 25,
    birthDate: new Date("2026-02-10"),
    arrivalDate: new Date("2026-06-01"),
    status: FlockStatus.ACTIVE,
    description: "Small flock for tests.",
};

export const mediumFlock: CreateFlockDTO = {
    name: "Lote Médio",
    quantity: 75,
    birthDate: new Date("2026-01-20"),
    arrivalDate: new Date("2026-05-20"),
    status: FlockStatus.ACTIVE,
    description: "Medium flock for tests.",
};

export const largeFlock: CreateFlockDTO = {
    name: "Lote Grande",
    quantity: 180,
    birthDate: new Date("2025-12-15"),
    arrivalDate: new Date("2026-04-30"),
    status: FlockStatus.ACTIVE,
    description: "Large flock for tests.",
};

export const oldestFlock: CreateFlockDTO = {
    name: "Lote Antigo",
    quantity: 90,
    birthDate: new Date("2024-08-01"),
    arrivalDate: new Date("2024-12-01"),
    status: FlockStatus.CLOSED,
    description: "Old flock.",
};

export const newestFlock: CreateFlockDTO = {
    name: "Lote Novo",
    quantity: 60,
    birthDate: new Date("2026-07-01"),
    arrivalDate: new Date("2026-07-20"),
    status: FlockStatus.ACTIVE,
    description: "Newest flock.",
};

export function makeFlock(data?: Partial<CreateFlockDTO>): CreateFlockDTO {
    return {
        ...activeFlock,
        ...data,
    };
}

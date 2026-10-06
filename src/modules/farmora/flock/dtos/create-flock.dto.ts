import { FlockEntity } from "../entities/flock.entity";

export type CreateFlockDTO = Pick<
    FlockEntity,
    "name" | "birthDate" | "arrivalDate" | "status" | "description"
> &
    Partial<Pick<FlockEntity, "createdAt">>;

export type CreateFlockResponseDTO = Pick<
    FlockEntity,
    | "uid"
    | "platformUID"
    | "name"
    | "birthDate"
    | "arrivalDate"
    | "status"
    | "description"
    | "createdBy"
    | "createdAt"
> & { weeks: number | null };

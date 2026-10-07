import { FlockEntity } from "../entities/flock.entity";

export type ResponseFlockDTO = Pick<
    FlockEntity,
    | "uid"
    | "platformUID"
    | "name"
    | "birthDate"
    | "arrivalDate"
    | "status"
    | "description"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
> & { weeks: number | null } & Partial<{
        quantity: number | null;
    }>;

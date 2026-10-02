import { FlockEntity } from "../entities/flock.entity";

export type CreateFlockDTO = Pick<
    FlockEntity,
    "name" | "quantity" | "birthDate" | "breedUID" | "arrivalDate" | "status" | "description"
> &
    Partial<Pick<FlockEntity, "createdAt">>;

export type CreateFlockResponseDTO = Pick<
    FlockEntity,
    | "uid"
    | "platformUID"
    | "breedUID"
    | "name"
    | "quantity"
    | "birthDate"
    | "arrivalDate"
    | "status"
    | "description"
    | "createdBy"
    | "createdAt"
>;

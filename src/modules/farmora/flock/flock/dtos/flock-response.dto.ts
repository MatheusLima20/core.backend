import { FlockEntity } from "../entities/flock.entity";

export type ResponseFlockDTO = Pick<
    FlockEntity,
    | "uid"
    | "platformUID"
    | "name"
    | "quantity"
    | "birthDate"
    | "arrivalDate"
    | "status"
    | "description"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;

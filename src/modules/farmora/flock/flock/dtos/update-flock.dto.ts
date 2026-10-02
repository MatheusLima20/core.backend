import { FlockEntity } from "../entities/flock.entity";
export interface UpdateFlockDTO extends Partial<
    Pick<
        FlockEntity,
        "breedUID" | "name" | "quantity" | "birthDate" | "arrivalDate" | "status" | "description"
    >
> {
    uid: string;
}

export type UpdateFlockResponseDTO = Pick<
    FlockEntity,
    | "uid"
    | "breedUID"
    | "name"
    | "quantity"
    | "birthDate"
    | "arrivalDate"
    | "status"
    | "description"
    | "updatedBy"
    | "updatedAt"
>;

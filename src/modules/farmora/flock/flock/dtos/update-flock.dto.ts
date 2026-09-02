import { FlockEntity } from "../entities/flock.entity";
export interface UpdateFlockDTO extends Partial<
    Pick<FlockEntity, "name" | "quantity" | "birthDate" | "arrivalDate" | "status" | "description">
> {
    uid: string;
}

export type UpdateFlockResponseDTO = Pick<
    FlockEntity,
    | "uid"
    | "name"
    | "quantity"
    | "birthDate"
    | "arrivalDate"
    | "status"
    | "description"
    | "updatedBy"
    | "updatedAt"
>;

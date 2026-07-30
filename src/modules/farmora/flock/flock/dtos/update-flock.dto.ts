import { FlockProps } from "../entities/flock.props";

export interface UpdateFlockDTO extends Partial<
    Pick<FlockProps, "name" | "quantity" | "birthDate" | "arrivalDate" | "status" | "description">
> {
    uid: string;
}

export type UpdateFlockResponseDTO = Pick<
    FlockProps,
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

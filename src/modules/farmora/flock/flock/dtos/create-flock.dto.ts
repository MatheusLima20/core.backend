import { FlockProps } from "../entities/flock.props";

export type CreateFlockDTO = Pick<
    FlockProps,
    "name" | "quantity" | "birthDate" | "arrivalDate" | "status" | "description"
> &
    Partial<Pick<FlockProps, "createdAt">>;

export type CreateFlockResponseDTO = Pick<
    FlockProps,
    | "uid"
    | "platformUID"
    | "name"
    | "quantity"
    | "birthDate"
    | "arrivalDate"
    | "status"
    | "description"
    | "createdBy"
    | "createdAt"
>;

import { FlockProps } from "../entities/flock.props";

export type ResponseFlockDTO = Pick<
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
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;

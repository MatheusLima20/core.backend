import { FlockProps } from "../entities/flock.props";
import { FlockStatus } from "../enums/flock-status.enum";

export interface FindFlocksDTO {
    name?: string;

    status?: FlockStatus;

    minQuantity?: number;
    maxQuantity?: number;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<FlockProps, "name" | "quantity" | "status" | "createdAt" | "updatedAt">;

    order?: "asc" | "desc";
}

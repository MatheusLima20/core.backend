import { FlockEntity } from "../entities/flock.entity";
import { FlockStatus } from "../enums/flock-status.enum";

export interface FindFlocksDTO {
    name?: string;

    status?: FlockStatus;

    minQuantity?: number;
    maxQuantity?: number;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<FlockEntity, "name" | "quantity" | "status" | "createdAt" | "updatedAt">;

    order?: "asc" | "desc";
}

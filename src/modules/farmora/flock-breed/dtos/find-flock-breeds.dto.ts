import { FlockBreedEntity } from "../entities/flock-breed.entity";

export interface FindFlockBreedsDTO {
    flockUID?: string;

    breedUID?: string;

    minQuantity?: number;
    maxQuantity?: number;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<FlockBreedEntity, "quantity" | "createdAt" | "updatedAt">;

    order?: "asc" | "desc";
}

import { FlockBreedEntity } from "../entities/flock-breed.entity";

export interface UpdateFlockBreedDTO extends Partial<Pick<FlockBreedEntity, "quantity">> {
    uid: string;
}

export type UpdateFlockBreedResponseDTO = Pick<
    FlockBreedEntity,
    "uid" | "flockUID" | "breedUID" | "quantity" | "updatedBy" | "updatedAt"
>;

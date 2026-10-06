import { FlockBreedEntity } from "../entities/flock-breed.entity";

export type CreateFlockBreedDTO = Pick<FlockBreedEntity, "flockUID" | "breedUID" | "quantity"> &
    Partial<Pick<FlockBreedEntity, "createdAt">>;

export type CreateFlockBreedResponseDTO = Pick<
    FlockBreedEntity,
    "uid" | "platformUID" | "flockUID" | "breedUID" | "quantity" | "createdBy" | "createdAt"
>;

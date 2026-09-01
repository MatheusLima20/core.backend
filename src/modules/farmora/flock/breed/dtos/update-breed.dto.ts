import { BreedEntity } from "../entities/breed.entity";

export type UpdateBreedDTO = Pick<BreedEntity, "uid"> &
    Partial<
        Pick<BreedEntity, "name" | "scientificName" | "eggColor" | "breedPurpose" | "description">
    >;

export type UpdateBreedResponseDTO = Pick<
    BreedEntity,
    | "uid"
    | "name"
    | "scientificName"
    | "eggColor"
    | "breedPurpose"
    | "description"
    | "updatedBy"
    | "updatedAt"
>;

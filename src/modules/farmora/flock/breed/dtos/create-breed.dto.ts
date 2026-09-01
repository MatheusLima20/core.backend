import { BreedEntity } from "../entities/breed.entity";

export type CreateBreedDTO = Pick<
    BreedEntity,
    "name" | "scientificName" | "eggColor" | "breedPurpose" | "description"
>;

export type CreateBreedResponseDTO = Pick<
    BreedEntity,
    | "uid"
    | "platformUID"
    | "name"
    | "scientificName"
    | "description"
    | "eggColor"
    | "breedPurpose"
    | "createdAt"
    | "createdBy"
>;

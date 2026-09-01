import { BreedEntity } from "../entities/breed.entity";

export type ResponseBreedDTO = Pick<
    BreedEntity,
    | "uid"
    | "platformUID"
    | "name"
    | "scientificName"
    | "eggColor"
    | "breedPurpose"
    | "description"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;

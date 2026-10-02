import { BreedEntity } from "../entities/breed.entity";

export type ResponseBreedDTO = Pick<
    BreedEntity,
    | "uid"
    | "name"
    | "scientificName"
    | "eggColor"
    | "urlImage"
    | "breedPurpose"
    | "description"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;

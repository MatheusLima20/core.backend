import { BreedProps } from "../entities/breed.props";

export type ResponseBreedDTO = Pick<
    BreedProps,
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

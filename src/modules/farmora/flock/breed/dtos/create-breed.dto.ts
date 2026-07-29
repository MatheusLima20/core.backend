import { BreedProps } from "../entities/breed.props";

export type CreateBreedDTO = Pick<
    BreedProps,
    "name" | "scientificName" | "eggColor" | "breedPurpose" | "description"
>;

export type CreateBreedResponseDTO = Pick<
    BreedProps,
    | "uid"
    | "platformUID"
    | "name"
    | "scientificName"
    | "description"
    | "eggColor"
    | "breedPurpose"
    | "createdBy"
>;

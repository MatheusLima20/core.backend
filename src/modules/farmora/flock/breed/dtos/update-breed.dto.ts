import { BreedProps } from "../entities/breed.props";

export type UpdateBreedDTO = Pick<BreedProps, "uid"> &
    Partial<
        Pick<BreedProps, "name" | "scientificName" | "eggColor" | "breedPurpose" | "description">
    >;

export type UpdateBreedResponseDTO = Pick<
    BreedProps,
    | "uid"
    | "name"
    | "scientificName"
    | "eggColor"
    | "breedPurpose"
    | "description"
    | "updatedBy"
    | "updatedAt"
>;

import { BreedProps } from "../entities/breed.props";
import { BreedPurpose } from "../enums/breed-origin.enum";
import { EggColor } from "../enums/egg-color.enum";

export interface FindBreedsDTO {
    name?: string;

    scientificName?: string;

    eggColor?: EggColor;

    breedPurpose?: BreedPurpose;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<
        BreedProps,
        "name" | "eggColor" | "breedPurpose" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}

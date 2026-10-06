import { BreedEntity } from "../entities/breed.entity";
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
        BreedEntity,
        "name" | "eggColor" | "breedPurpose" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}

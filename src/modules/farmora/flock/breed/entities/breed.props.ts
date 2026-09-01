import { BreedPurpose } from "../enums/breed-origin.enum";
import { EggColor } from "../enums/egg-color.enum";

export interface BreedProps {
    uid?: string;

    platformUID?: string;

    name: string;

    scientificName?: string;

    eggColor?: EggColor;

    breedPurpose?: BreedPurpose;

    description?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt: Date;
    updatedAt: Date;
}

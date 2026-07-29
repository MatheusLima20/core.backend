import { BreedPurpose } from "../enums/breed-origin.enum";
import { EggColor } from "../enums/egg-color.enum";
import { BreedProps } from "./breed.props";

export class BreedEntity implements BreedProps {
    uid!: string;

    platformUID?: string;

    name!: string;

    scientificName?: string;

    eggColor?: EggColor;

    breedPurpose?: BreedPurpose;

    description?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: BreedProps) {
        Object.assign(this, props);
    }
}

import { CreateBreedDTO } from "../../../dtos/create-breed.dto";
import { BreedPurpose } from "../../../enums/breed-origin.enum";
import { EggColor } from "../../../enums/egg-color.enum";

export const dataBreed1: CreateBreedDTO = {
    name: "Isa Brown",
    scientificName: "Gallus gallus domestics",
    eggColor: EggColor.BROWN,
    breedPurpose: BreedPurpose.LAYING,
    description: "Commercial laying breed.",
};

export const dataBreed2: CreateBreedDTO = {
    name: "Novogen Brown",
    scientificName: "Gallus gallus domestics",
    eggColor: EggColor.BLUE,
    breedPurpose: BreedPurpose.ORNAMENTAL,
    description: "High-performance laying breed.",
};

export function makeBreed(data?: Partial<CreateBreedDTO>): CreateBreedDTO {
    return {
        ...dataBreed1,
        ...data,
    };
}

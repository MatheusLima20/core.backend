import { CreateFlockBreedDTO } from "../../../dtos/create-flock-breed.dto";

export const flockBreed1: CreateFlockBreedDTO = {
    flockUID: "flk-test-1",
    breedUID: "brd_isa-brown",
    quantity: 40,
};

export const flockBreed2: CreateFlockBreedDTO = {
    flockUID: "flk-test-1",
    breedUID: "brd-novogen-tinted",
    quantity: 35,
};

export const flockBreed3: CreateFlockBreedDTO = {
    flockUID: "flk-test-1",
    breedUID: "brd-novogen-brown",
    quantity: 25,
};

export const flockBreed4: CreateFlockBreedDTO = {
    flockUID: "flk-test-3",
    breedUID: "brd_isa-brown",
    quantity: 50,
};

export const flockBreed5: CreateFlockBreedDTO = {
    flockUID: "flk-test-1",
    breedUID: "brd_isa-brown",
    quantity: 50,
};

export function makeFlockBreed(data?: Partial<CreateFlockBreedDTO>): CreateFlockBreedDTO {
    return {
        ...flockBreed1,
        ...data,
    };
}
